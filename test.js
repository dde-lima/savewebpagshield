function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://s3.atendimentoonline.cloud/typebot/public/workspaces/cm4h5widm0007uw0d1tmvwezu/typebots/cm4h5zgoe000euw0d4h1nuklq/hostAvatar?v=1733804036053', var_insta_url = '#') {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      .user-bar {
        width: 100%;
        height: 100px;
        background: #089141;
        display: flex;
        align-items: center;
        padding: 0 8px;
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
        gap: 8px;
      }
  
      .user-bar .logo .avatar-container {
        margin: 0;
        background-color: orange;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(orange, orange) padding-box, 
                  linear-gradient(45deg, #408FF5, #0D65B9, #171C2A) border-box;
        border: 2.5px solid transparent;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
      }

      .user-bar .logo .avatar-container img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
  
      .user-bar .logo .name-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: -2px;
      }

      .user-bar .logo .name-wrapper {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .user-bar .logo .name {
        color: white;
        font-size: 17px;
        font-weight: 600;
        line-height: 1;
      }

      .user-bar .logo .verified-icon {
        width: 15px;
        height: 15px;
        margin-top: -2px;
      }

      .user-bar .logo .subtitle {
        color: white;
        font-size: 13px;
        font-weight: 400;
        opacity: 0.9;
        line-height: 1;
      }

      .user-bar .back {
        color: white;
        margin-right: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
  
      .user-bar .back svg {
        fill: currentColor;
        width: 1em;
        height: 1em;
        font-size: 22px;
      }
  
      .typebot-chat-view {
        margin-top: 108px !important;
        padding-top: 0;
      }

      .typebot-container > div:nth-child(2) {
        margin-top: 108px !important;
      }

      .typebot-chat-view > div {
        margin-top: 108px !important;
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
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
        <g transform="rotate(-90 512 512)">
          <path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"></path>
        </g>
      </svg>
    `;
  
    backButton.addEventListener("click", function () {
      window.location.href = `${var_insta_url}`;
    });
  
    var logo = document.createElement("div");
    logo.className = "logo";
    logo.innerHTML = `
      <div class="avatar-container">
        <img src="${var_avatar}" alt="Avatar">
      </div>
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
