function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://s3.atendimentoonline.cloud/typebot/public/workspaces/cm4h5widm0007uw0d1tmvwezu/typebots/cm4h5zgoe000euw0d4h1nuklq/hostAvatar?v=1733804036053', var_insta_url = '#') {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      .user-bar {
        width: 100%;
        height: 64px;
        background: #00A650;
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
      }
  
      .user-bar .logo {
        display: flex;
        align-items: center;
        gap: 12px;
      }
  
      .user-bar .logo img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
  
      .user-bar .logo .name-container {
        display: flex;
        flex-direction: column;
      }

      .user-bar .logo .name {
        color: white;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .user-bar .logo .subtitle {
        color: white;
        font-size: 13px;
        font-weight: 400;
        opacity: 0.9;
      }

      .user-bar .back {
        color: white;
        margin-right: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
  
      .user-bar .back svg {
        fill: white;
        width: 20px;
        height: 20px;
      }
  
      .typebot-chat-view {
        margin-top: 64px;
      }
    `;
  
    var cssId = 'myCss';
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName("typebot-standard")[0].shadowRoot.querySelector('.typebot-container');
      var styleSheet = document.createElement("style");
      styleSheet.id = cssId;
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      head.appendChild(styleSheet);
    }
  
    var elementoPai = document.getElementsByTagName("typebot-standard")[0].shadowRoot.querySelector('.typebot-container');
    var userBar = document.createElement("div");
    userBar.className = "user-bar";
  
    var backButton = document.createElement("div");
    backButton.className = "back";
    backButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
      </svg>
    `;
  
    backButton.addEventListener("click", function () {
      window.location.href = `${var_insta_url}`;
    });
  
    var logo = document.createElement("div");
    logo.className = "logo";
    logo.innerHTML = `
      <img src="${var_avatar}" alt="Avatar">
      <div class="name-container">
        <div class="name">${var_nome}</div>
        <div class="subtitle">Atendimento</div>
      </div>
    `;
  
    userBar.appendChild(backButton);
    userBar.appendChild(logo);
    elementoPai.insertBefore(userBar, elementoPai.firstChild);
}
