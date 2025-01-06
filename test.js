function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://via.placeholder.com/50', var_insta_url = '#') {
  // Estilos CSS para a navbar
  const css = `
    .user-bar {
      width: 100%;
      height: 70px;
      background: #2E7D32; /* Cor verde, conforme a imagem */
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
      font-size: 18px;
      font-weight: bold;
    }

    .user-bar .logo img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-bar .logo span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .user-bar .logo svg {
      width: 18px;
      height: 18px;
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
    Voltar
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
    <span>${var_nome} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" height="16" width="16" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18" xml:space="preserve">
      <polygon id="Star-2" fill="#0099FD" points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9 "></polygon>
      <polygon id="Check-Icon" fill="#FFFFFF" points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4 "></polygon>
    </svg></span>
  `;

  // Adicionando os elementos à barra de usuário
  userBar.appendChild(backButton);
  userBar.appendChild(logo);

  // Inserindo a navbar no elemento pai
  if (elementoPai) {
    elementoPai.prepend(userBar);
  }
}
