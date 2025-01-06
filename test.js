function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://via.placeholder.com/50', var_insta_url = '#') {
  // Estilos CSS para a navbar
  const css = `
    .user-bar {
      width: 100%;
      height: 70px;
      background: #2E7D32; /* Cor verde conforme a imagem */
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      z-index: 9999;
    }

    .user-bar .logo {
      display: flex;
      align-items: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
    }

    .user-bar .logo img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      border: 2px solid white; /* Borda branca ao redor do avatar */
    }

    .user-bar .logo span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-bar .logo .name {
      font-size: 16px;
    }

    .user-bar .logo .status {
      font-size: 12px;
      opacity: 0.9;
    }

    .user-bar .back {
      display: flex;
      align-items: center;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .user-bar .back svg {
      margin-right: 5px;
      fill: white;
    }

    .typebot-chat-view {
      margin-top: 70px; /* Adiciona margem abaixo da navbar para não sobrepor mensagens */
    }
  `;

  // Verifica se o estilo já foi adicionado, senão, adiciona-o ao shadow DOM do typebot-standard
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
    </svg>
  `;

  // Adicionando um evento de clique para redirecionar quando o botão de voltar for clicado
  backButton.addEventListener("click", function () {
    window.location.href = `${var_insta_url}`; // Substitua pelo URL desejado
  });

  // Logotipo e texto
  var logo = document.createElement("div");
  logo.className = "logo";
  logo.innerHTML = `
    <img src="${var_avatar}" alt="Avatar">
    <span>
      <span class="name">${var_nome}</span>
      <span class="status">Atendimento</span>
    </span>
  `;

  // Adicionando os elementos à barra de usuário
  userBar.appendChild(backButton);
  userBar.appendChild(logo);

  // Inserindo a navbar no elemento pai
  if (elementoPai) {
    elementoPai.prepend(userBar);
  }
}
