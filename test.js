function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://via.placeholder.com/50', var_insta_url = '#') {
    const css = `
      .user-bar {
        width: 100%;
        height: 56px;
        background: #00A650;
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        z-index: 9999;
      }
  
      .user-bar .logo {
        display: flex;
        align-items: center;
        gap: 8px;
      }
  
      .user-bar .logo img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
  
      .user-bar .logo .name {
        color: white;
        font-size: 16px;
        font-weight: 500;
      }

      .user-bar .back {
        color: white;
        margin-right: 16px;
        cursor: pointer;
      }
  
      .user-bar .back svg {
        fill: white;
        width: 24px;
        height: 24px;
      }
  
      .typebot-chat-view {
        margin-top: 56px;
      }
    `;
  
    // Verifica se o estilo já foi adicionado
    var cssId = 'myCss';
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName("typebot-standard")[0].shadowRoot.querySelector('.typebot-container');
      var styleSheet = document.createElement("style");
      styleSheet.id = cssId;
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      head.appendChild(styleSheet);
    }
  
    // Criação da navbar
    var elementoPai = document.getElementsByTagName("typebot-standard")[0].shadowRoot.querySelector('.typebot-container');
    var userBar = document.createElement("div");
    userBar.className = "user-bar";
  
    // Botão de voltar
    var backButton = document.createElement("div");
    backButton.className = "back";
    backButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
    `;
  
    backButton.addEventListener("click", function () {
      window.location.href = `${var_insta_url}`;
    });
  
    // Logo e nome
    var logo = document.createElement("div");
    logo.className = "logo";
    logo.innerHTML = `
      <img src="${var_avatar}" alt="Avatar">
      <div class="name">${var_nome}</div>
    `;
  
    userBar.appendChild(backButton);
    userBar.appendChild(logo);
    elementoPai.insertBefore(userBar, elementoPai.firstChild);
}
