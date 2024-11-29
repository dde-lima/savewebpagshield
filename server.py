import os
import requests
from flask import Flask, render_template, request, send_file, redirect, url_for, flash
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, unquote
from zipfile import ZipFile
import re
import time
import zipfile
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from werkzeug.utils import secure_filename
import cssutils
import logging

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta'

# Configurar cssutils para suprimir logs
cssutils.log.setLevel('FATAL')

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def sanitize_path_component(component):
    """
    Remove ou substitui caracteres inválidos em um componente de caminho (diretório ou arquivo).
    """
    return re.sub(r'[<>:"\\|?*]', '_', component)

def sanitize_filepath(filepath):
    """
    Sanitiza cada componente do caminho do arquivo separadamente, preservando os separadores de diretório.
    """
    parts = filepath.split('/')
    sanitized_parts = [sanitize_path_component(part) for part in parts]
    return '/'.join(sanitized_parts)

def is_valid_scheme(url):
    """
    Verifica se o esquema da URL é suportado pelo requests.
    """
    parsed = urlparse(url)
    return parsed.scheme in ['http', 'https']

def save_website(url, output_zip):
    with tempfile.TemporaryDirectory() as temp_dir:
        # Definir subpastas para diferentes tipos de recursos
        subfolders = {
            'css': 'css',
            'js': 'js',
            'images': 'images',
            'fonts': 'fonts',
            'media': 'media',  # Adicionado para incluir a pasta 'media'
            'others': 'assets'
        }

        # Criar subpastas
        for folder in subfolders.values():
            os.makedirs(os.path.join(temp_dir, folder), exist_ok=True)

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, como Gecko) "
                          "Chrome/112.0.0.0 Safari/537.36"
        }

        session = requests.Session()
        session.headers.update(headers)

        try:
            response = session.get(url, timeout=10)
            response.raise_for_status()
        except requests.RequestException as e:
            raise Exception(f"Erro ao acessar a URL principal: {e}")

        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')

        # Salvar o arquivo HTML principal
        html_file_path = os.path.join(temp_dir, "index.html")

        # Listar todos os recursos a serem baixados
        resource_tags = []
        for tag in soup.find_all(['script', 'link', 'img']):
            if tag.name == 'script' and tag.get('src'):
                resource_tags.append(('src', tag))
            elif tag.name == 'link' and tag.get('href'):
                resource_tags.append(('href', tag))
            elif tag.name == 'img' and tag.get('src'):
                resource_tags.append(('src', tag))

        # Adicionar estilos inline
        inline_styles = soup.find_all(style=True)

        # Função para determinar a subpasta
        def get_subfolder(file_url):
            """
            Determina a subpasta com base na extensão do arquivo.
            """
            parsed = urlparse(file_url)
            path = parsed.path.lower()
            if path.endswith('.css'):
                return subfolders['css']
            elif path.endswith('.js'):
                return subfolders['js']
            elif any(path.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']):
                return subfolders['images']
            elif any(path.endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
                return subfolders['fonts']
            elif 'media' in path:
                return subfolders['media']
            else:
                return subfolders['others']

        # Lista para armazenar os resultados dos downloads
        download_results = []

        # Função para baixar um único recurso
        def download_resource(attribute, tag):
            src = tag.get(attribute)
            if src:
                resource_url = urljoin(url, src)
                if not is_valid_scheme(resource_url):
                    logger.warning(f"Esquema não suportado para URL: {resource_url}. Ignorando.")
                    return
                try:
                    response = session.get(resource_url, timeout=10)
                    response.raise_for_status()
                    parsed_url = urlparse(resource_url)
                    path = unquote(parsed_url.path).lstrip('/')
                    if not path:
                        path = 'index'
                    # Sanitizar o caminho do arquivo
                    path = sanitize_filepath(path)
                    subfolder = get_subfolder(resource_url)
                    file_path = os.path.join(temp_dir, subfolder, path)
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    with open(file_path, "wb") as f:
                        f.write(response.content)
                    # Ajustar caminho relativo no HTML
                    relative_path = os.path.relpath(file_path, temp_dir).replace('\\', '/')
                    tag[attribute] = relative_path
                    logger.info(f"Baixado: {resource_url}")
                except requests.RequestException as e:
                    logger.error(f"Erro ao baixar o arquivo: {resource_url}. Detalhes: {e}")

        # Usar ThreadPoolExecutor para baixar recursos concorrentemente
        with ThreadPoolExecutor(max_workers=10) as executor:
            # Enviar tarefas de download
            futures = [executor.submit(download_resource, attr, tag) for attr, tag in resource_tags]
            # Aguardar a conclusão
            for future in as_completed(futures):
                pass  # Os resultados são tratados na própria função

        # Processar estilos inline
        def process_inline_style(tag):
            style_content = tag['style']
            updated_style = process_css_content(style_content, url, session, temp_dir)
            tag['style'] = updated_style

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(process_inline_style, tag) for tag in inline_styles]
            for future in as_completed(futures):
                pass

        # Salvar o HTML atualizado
        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))

        # Processar arquivos CSS externos
        css_links = soup.find_all("link", rel="stylesheet")
        css_futures = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            for link in css_links:
                href = link.get("href")
                if href:
                    css_url = urljoin(url, href)
                    if not is_valid_scheme(css_url):
                        logger.warning(f"Esquema não suportado para CSS: {css_url}. Ignorando.")
                        continue
                    css_futures.append(executor.submit(process_external_css, css_url, session, temp_dir, subfolders))
            for future in as_completed(css_futures):
                pass

        # Determinar o método de compressão
        if hasattr(zipfile, 'ZIP_DEFLATED'):
            compression = zipfile.ZIP_DEFLATED
        else:
            logger.warning("ZIP_DEFLATED não está disponível. Usando ZIP_STORED sem compressão.")
            compression = zipfile.ZIP_STORED

        # Criar o arquivo zip
        with ZipFile(output_zip, 'w', compression) as zipf:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, temp_dir)
                    zipf.write(file_path, arcname)

def process_external_css(css_url, session, temp_dir, subfolders):
    """
    Baixa e processa arquivos CSS externos.
    """
    try:
        response = session.get(css_url, timeout=10)
        response.raise_for_status()
        parsed_url = urlparse(css_url)
        path = unquote(parsed_url.path).lstrip('/')
        if not path:
            path = 'style.css'
        path = sanitize_filepath(path)
        subfolder = get_subfolder(css_url)
        css_file_path = os.path.join(temp_dir, subfolder, path)
        os.makedirs(os.path.dirname(css_file_path), exist_ok=True)
        with open(css_file_path, "w", encoding="utf-8") as f:
            f.write(response.text)
        # Processar o conteúdo CSS
        with open(css_file_path, 'r', encoding='utf-8') as css_file:
            css_content = css_file.read()

        updated_css_content = process_css_content(css_content, css_url, session, temp_dir)

        with open(css_file_path, 'w', encoding='utf-8') as css_file:
            css_file.write(updated_css_content)
        logger.info(f"Processado CSS externo: {css_url}")
    except requests.RequestException as e:
        logger.error(f"Erro ao baixar o CSS externo: {css_url}. Detalhes: {e}")

def get_subfolder(file_url):
    """
    Determina a subpasta com base na extensão do arquivo.
    """
    subfolders = {
        'css': 'css',
        'js': 'js',
        'images': 'images',
        'fonts': 'fonts',
        'media': 'media',  # Adicionado para incluir a pasta 'media'
        'others': 'assets'
    }
    parsed = urlparse(file_url)
    path = parsed.path.lower()
    if path.endswith('.css'):
        return subfolders['css']
    elif path.endswith('.js'):
        return subfolders['js']
    elif any(path.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']):
        return subfolders['images']
    elif any(path.endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
        return subfolders['fonts']
    elif 'media' in path:
        return subfolders['media']
    else:
        return subfolders['others']

def process_css_content(css_content, base_url, session, temp_dir):
    """
    Processa o conteúdo CSS para baixar fontes e atualizar URLs.
    """
    sheet = cssutils.parseString(css_content)
    for rule in sheet:
        if rule.type == rule.STYLE_RULE:
            for property in rule.style:
                if 'url(' in property.value:
                    urls = re.findall(r'url\((.*?)\)', property.value)
                    for original_url in urls:
                        clean_url = original_url.strip('\'" ')
                        absolute_url = urljoin(base_url, clean_url)
                        if not is_valid_scheme(absolute_url):
                            logger.warning(f"Esquema não suportado para URL no CSS: {absolute_url}. Ignorando.")
                            continue
                        try:
                            response = session.get(absolute_url, timeout=10)
                            response.raise_for_status()
                            parsed_url = urlparse(absolute_url)
                            path = unquote(parsed_url.path).lstrip('/')
                            if not path:
                                path = 'resource'
                            path = sanitize_filepath(path)
                            subfolder = get_subfolder(absolute_url)
                            file_path = os.path.join(temp_dir, subfolder, path)
                            os.makedirs(os.path.dirname(file_path), exist_ok=True)
                            with open(file_path, "wb") as f:
                                f.write(response.content)
                            relative_path = os.path.relpath(file_path, temp_dir).replace('\\', '/')
                            # Atualizar a URL no CSS
                            property.value = property.value.replace(original_url, f'"{relative_path}"')
                            logger.info(f"Baixado recurso do CSS: {absolute_url}")
                        except requests.RequestException as e:
                            logger.error(f"Erro ao baixar recurso do CSS: {absolute_url}. Detalhes: {e}")
    return sheet.cssText.decode('utf-8')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('url')
        if not url:
            flash("Por favor, insira uma URL válida.", "danger")
            return redirect(url_for('index'))

        parsed_url = urlparse(url)
        if not parsed_url.scheme:
            url = 'http://' + url

        try:
            temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
            temp_zip.close()

            save_website(url, temp_zip.name)

            return send_file(
                temp_zip.name,
                mimetype='application/zip',
                as_attachment=True,
                download_name='website.zip'
            )
        except Exception as e:
            logger.error(f"Ocorreu um erro: {e}")
            flash(f"Ocorreu um erro: {e}", "danger")
            return redirect(url_for('index'))

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
