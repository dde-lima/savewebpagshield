function criarBarra(var_nome = 'CredFácil', var_avatar = 'https://s3.atendimentoonline.cloud/typebot/public/workspaces/cm4h5widm0007uw0d1tmvwezu/typebots/cm4h5zgoe000euw0d4h1nuklq/hostAvatar?v=1733804036053', var_insta_url = '#') {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      .user-bar {
        width: 100%;
        height: 100px;
        background: #089141;
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
  
      .user-bar .back {
        color: white;
        margin-right: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
  
      .user-bar .back svg {
        fill: currentColor;
        width: 1em;
        height: 1em;
        font-size: 24px;
      }

      .user-bar .avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
      }

      .user-bar .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .user-bar .name {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
      }

      .user-bar .name span:first-child {
        color: white;
        font-size: 18px;
        font-weight: 600;
      }

      .user-bar .name .status {
        color: white;
        font-size: 14px;
        font-weight: 400;
        opacity: 0.9;
        display: block;
        margin-top: 2px;
      }

      .user-bar .actions {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      .typebot-chat-view {
        margin-top: 120px !important;
        padding-top: 20px;
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
  
    userBar.innerHTML = `
      <div class="back">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
          <g transform="rotate(-90 512 512)">
            <path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"></path>
          </g>
        </svg>
      </div>
      <div class="avatar">
        <img src="${var_avatar}" alt="Rodrigo">
      </div>
      <div class="name">
        <span>${var_nome}</span>
        <span data-testid="psa-verified" data-icon="psa-verified" class="">
          <svg viewBox="3 0 14 16" height="17" width="18" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18" xml:space="preserve">
            <polygon id="Star-2" fill="#27a1f9" points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9"></polygon>
            <polygon id="Check-Icon" fill="#FFFFFF" points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4"></polygon>
          </svg>
        </span>
        <span class="status">Atendimento</span>
      </div>
      <div class="actions more"></div>
      <div class="actions attachment"></div>
      <div class="actions"></div>
    `;

    const backButton = userBar.querySelector('.back');
    backButton.addEventListener("click", function () {
      window.location.href = `${var_insta_url}`;
    });
  
    elementoPai.insertBefore(userBar, elementoPai.firstChild);
}
