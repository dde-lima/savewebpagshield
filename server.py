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
from werkzeug.utils import secure_filename
import cssutils

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta'

# Configurar cssutils para suprimir logs
cssutils.log.setLevel('FATAL')

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
            response = session.get(url)
            response.raise_for_status()
        except requests.RequestException as e:
            raise Exception(f"Erro ao acessar a URL principal: {e}")

        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')

        # Salvar o arquivo HTML principal
        html_file_path = os.path.join(temp_dir, "index.html")

        # Atualizar caminhos de recursos no HTML
        def update_html_resources(soup):
            for tag in soup.find_all(['script', 'link', 'img']):
                if tag.name == 'script' and tag.get('src'):
                    update_resource_paths(tag, 'src')
                elif tag.name == 'link' and tag.get('href'):
                    update_resource_paths(tag, 'href')
                elif tag.name == 'img' and tag.get('src'):
                    update_resource_paths(tag, 'src')

            # Atualizar estilos inline
            for tag in soup.find_all(style=True):
                style_content = tag['style']
                updated_style = process_css_content(style_content, url)
                tag['style'] = updated_style

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

        def download_file(file_url, max_retries=3, delay=1):
            try:
                response = session.get(file_url, timeout=10)
                response.raise_for_status()
                parsed_url = urlparse(file_url)
                path = unquote(parsed_url.path).lstrip('/')
                if not path:
                    path = 'index'
                # Sanitizar o caminho do arquivo
                path = sanitize_filepath(path)
                subfolder = get_subfolder(file_url)
                file_path = os.path.join(temp_dir, subfolder, path)
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, "wb") as f:
                    f.write(response.content)
                # Retornar o caminho relativo a partir do diretório temporário
                relative_path = os.path.relpath(file_path, temp_dir)
                return relative_path.replace('\\', '/')
            except requests.RequestException as e:
                if max_retries > 0:
                    print(f"Erro ao baixar o arquivo: {file_url}. Tentando novamente em {delay} segundos...")
                    time.sleep(delay)
                    return download_file(file_url, max_retries - 1, delay * 2)
                else:
                    print(f"Erro ao baixar o arquivo: {file_url}. Detalhes: {e}")
                    return None

        def update_resource_paths(tag, attribute):
            src = tag.get(attribute)
            if src:
                resource_url = urljoin(url, src)
                saved_path = download_file(resource_url)
                if saved_path:
                    # Ajustar caminho relativo no HTML
                    tag[attribute] = saved_path

        def process_css_content(css_content, base_url):
            """
            Processa o conteúdo CSS para baixar fontes e atualizar URLs.
            """
            urls = re.findall(r'url\((.*?)\)', css_content)
            for original_url in urls:

                clean_url = original_url.strip('\'" ')
                absolute_url = urljoin(base_url, clean_url)
                if any(clean_url.lower().endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
                    saved_path = download_file(absolute_url)
                    if saved_path:
                        css_content = css_content.replace(original_url, f'"{saved_path}"')
                else:
                    saved_path = download_file(absolute_url)
                    if saved_path:
                        css_content = css_content.replace(original_url, f'"{saved_path}"')
            return css_content

        update_html_resources(soup)

        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))

        for link in soup.find_all("link", rel="stylesheet"):
            href = link.get("href")
            if href:
                css_url = urljoin(url, href)
                saved_css_path = download_file(css_url)
                if saved_css_path:
                    full_css_path = os.path.join(temp_dir, saved_css_path)
                    try:
                        with open(full_css_path, 'r', encoding='utf-8') as css_file:
                            css_content = css_file.read()

                        updated_css_content = process_css_content(css_content, css_url)

                        with open(full_css_path, 'w', encoding='utf-8') as css_file:
                            css_file.write(updated_css_content)

                    except Exception as e:
                        print(f"Erro ao processar CSS {saved_css_path}: {e}")

        # Determinar o método de compressão
        if hasattr(zipfile, 'ZIP_DEFLATED'):
            compression = zipfile.ZIP_DEFLATED
        else:
            print("ZIP_DEFLATED não está disponível. Usando ZIP_STORED sem compressão.")
            compression = zipfile.ZIP_STORED

        with ZipFile(output_zip, 'w', compression) as zipf:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, temp_dir)
                    zipf.write(file_path, arcname)

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
            flash(f"Ocorreu um erro: {e}", "danger")
            return redirect(url_for('index'))

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
