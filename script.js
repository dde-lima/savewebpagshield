
function criarBarra() {
  // CSS mínimo para esconder elementos
  const css = `
    .hide {
      display: none !important;
    }
    #lite-badge {
      display: none !important;
    }
  `;

  // Verifica se o estilo já foi adicionado
  const cssId = 'myCustomCss';
  if (!document.getElementById(cssId)) {
    // Captura o Shadow DOM do typebot
    const head = document
      .getElementsByTagName("typebot-standard")[0]
      .shadowRoot.querySelector(".typebot-container");
    
    // Cria e injeta o <style>
    const styleSheet = document.createElement("style");
    styleSheet.id = cssId;
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    
    // Adiciona ao container do Shadow DOM
    head.appendChild(styleSheet);
  }
}

