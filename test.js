function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://s3.atendimentoonline.cloud/typebot/public/workspaces/cm4h5widm0007uw0d1tmvwezu/typebots/cm4h5zgoe000euw0d4h1nuklq/hostAvatar?v=1733804036053', var_insta_url = '#') {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      .user-bar {
        width: 100%;
        height: 100px;
        background: #00A650;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
      }
  
      .user-bar .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
      }
  
      .user-bar .logo img {
        width: 52px;
        height: 52px;
        border-radius: 50%;
      }
  
      .user-bar .logo .name-container {
        display: flex;
        flex-direction: column;
      }

      .user-bar .logo .name-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .user-bar .logo .name {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .user-bar .logo .verified-icon {
        width: 18px;
        height: 18px;
        margin-top: 2px;
      }

      .user-bar .logo .subtitle {
        color: white;
        font-size: 14px;
        font-weight: 400;
        opacity: 0.9;
      }

      .user-bar .back {
        color: white;
        margin-right: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
  
      .user-bar .back svg {
        fill: white;
        width: 28px;
        height: 28px;
      }
  
      .typebot-chat-view {
        margin-top: 100px;
      }

      @media screen and (max-width: 414px) {
        .user-bar {
          width: 414px;
        }
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
        <div class="name-wrapper">
          <div class="name">${var_nome}</div>
          <svg viewBox="3 0 14 16" height="17" width="18" preserveAspectRatio="xMidYMid meet" class="verified-icon" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18" xml:space="preserve">
            <polygon id="Star-2" fill="#27a1f9" points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9"></polygon>
            <polygon id="Check-Icon" fill="#FFFFFF" points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4"></polygon>
          </svg>
        </div>
        <div class="subtitle">Atendimento</div>
      </div>
    `;
  
    userBar.appendChild(backButton);
    userBar.appendChild(logo);
    elementoPai.insertBefore(userBar, elementoPai.firstChild);
}
