function criarBarra(var_nome = 'Seu Nome', var_avatar = '', var_insta_nome = 'seunome', var_insta_url = 'https://instagram.com', var_seguidores = '1,2 mil', var_publi = '132') {
  // Estilos CSS embutidos diretamente no JavaScript
  const css = `
    .typebot-container {background: #000;}
    .typebot-chat-view {padding-top: 90px;}
    .typebot-input-container {position: fixed; bottom: 10px; right: 15px; z-index: 999;}
    .typebot-input-form .text-input {border-radius: 40px !important; height: 50px;}
    .typebot-container {background-size: initial !important; background-repeat: repeat-x !important; height: 100% !important;}

    /* User Bar */
    .user-bar {
      width: 100%;
      height: 100px;
      background: #121212;
      color: #fff;
      padding: 0;
      font-size: 25px;
      position: absolute;
      z-index: 99999;
      display: block;
      top: 0;
    }
    .user-bar div {
      float: left;
      transform: translateY(-50%);
      position: relative;
      top: 50%;
      margin-left: 10px;
    }
    .user-bar .avatar {
      margin: 0 0 0 5px;
      background-color: black;
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50%;
      background: linear-gradient(black, black) padding-box, linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7) border-box;
      border: 3px solid transparent;
      padding: 1px;
    }
    .user-bar .avatar img {
      border-radius: 50%;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user-bar .name {
      float: left;
      font-size: 17px;
      font-weight: 600;
      text-overflow: ellipsis;
      margin: 0 0 0 8px;
      overflow: hidden;
      white-space: nowrap;
    }

    /* Ajustes específicos para o botão */
    .typebot-chat-view button:first-of-type {
      align-self: stretch !important;  /* Ocupa toda a largura disponível */
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 0 !important;     /* Remove arredondamento */
      width: calc(100% - 32px) !important; /* Largura alinhada às mensagens */
      box-sizing: border-box;
    }
    .typebot-chat-view button:first-of-type span {
      border-radius: 0 !important;
      padding: 7px 15px !important;
      display: inline-block;
      width: 100%;
    }
  `;

  // Injeção do CSS no Shadow DOM
  var cssId = 'myCss';  
  if (!document.getElementById(cssId)) {
    var head = document.getElementsByTagName("typebot-standard")[0]
                    .shadowRoot.querySelector('.typebot-container');
    var styleSheet = document.createElement("style");
    styleSheet.id = cssId;
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    head.appendChild(styleSheet);
  }

  // Remove o scroll no iOS
  const bodyType = document.querySelector('body');
  let scrollPosition = window.pageYOffset;
  bodyType.style.overflow = 'hidden';
  bodyType.style.position = 'fixed';
  bodyType.style.top = `-${scrollPosition}px`;
  bodyType.style.width = '100%';

  // Criação e inserção da user bar
  var varStatus = document.createElement("span");
  var elementoPai = document.getElementsByTagName("typebot-standard")[0]
                        .shadowRoot.querySelector('.typebot-container');
  var userBar = document.createElement("div");
  userBar.className = "user-bar";

  // Botão de voltar
  var backButton = document.createElement("div");
  backButton.className = "back";
  backButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
  </svg>`;
  backButton.addEventListener("click", function() {
    window.location.href = `${var_insta_url}`;
  });

  // Avatar
  var avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.innerHTML = `<img src="${var_avatar}">`;

  // Nome
  var name = document.createElement("div");
  name.className = "name";
  name.innerHTML = `<span>${var_nome}</span>`;

  // Montagem da user bar
  userBar.appendChild(backButton);
  userBar.appendChild(avatar);
  userBar.appendChild(name);

  // Adicionar a user bar no topo
  if (elementoPai) {
    elementoPai.prepend(userBar);
  }

  // Atualização do status
  setInterval(() => {
    const isTyping = elementoPai.querySelector('.bubble1');
    const status = isTyping ? 'digitando...' : 'online';
    varStatus.innerText = status;
  }, 100);
}
