class ShowHide extends HTMLElement {
    constructor() {
        super();
        this._toggleBtn = ''; // will be used in functions so declared here
        this._infoVisible = false;
        this._arrayPosts = [];
        this._id = '';
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `
       
        <style>
            * { 
              font-family: var(--main-font, sans-serif);
            }
            #info {
                display:none;
                padding:20px;
                background:#ccc;
                max-width@800px;
                margin:0 auto;
                margin-top:20px;
                border: 4px solid #2196f3;
                border-radius:10px;
                font-size: var(--main-font-size, 22px);         
            }
            #btn {
                background-color: orange;
                color: #fff;
                font-size:22px;
                width:300px;     
            }
            .content {
              display:flex;
              justify-content: center;
            }
            @media only screen and (max-width: 700px) {
             #info {
              font-size: var(--mobile-font-size, 16px);
              }
              #btn {
                  font-size: var(--mobile-font-size, 16px);
              }
          }
        </style>
        <div class="content">
          <button id="btn">GET LIST</button>
        </div>
        <div id="info"></div>
    `;
    }
    connectedCallback() {
        this._toggleBtn = this.shadowRoot.querySelector('#btn');
        this._toggleBtn.addEventListener('click', this._showInfo.bind(this));
        this._getPosts();
        this._render();
    }
    disconnectedCallback() {
        this._toggleBtn.removeEventListener('click', this._showInfo);
    }
    _getPosts() {
        //let apiUrl = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts?categories=25';
        let apiUrl = '../_data/cat25.json';
        let i;
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                for (i = 0; i < data.length; i++) {
                    this._id = data[i].id;
                    this._arrayPosts.push(JSON.stringify(data[i]));
                }
            });
    }
    _render() {
        let info = this.shadowRoot.querySelector('#info');
        if (this._infoVisible) {
            info.style.display = 'block';
            info.innerHTML = '<h3>DATA LOADED FROM AJAX CALL TO REST_API</h3>';
            var jsonData;
            var i;
            for (i = 0; i < 7; i++) {
                jsonData = JSON.parse(this._arrayPosts[i]);
                info.innerHTML += 'PostID: <b>' + jsonData.id + '</b><br> Title: <b>' + jsonData.title.rendered + '</b> by Author ';
                info.innerHTML += '<b>' + jsonData.authorName.toUpperCase() + '</b><br><br>';
            }
            this._infoVisible = false;
            this._toggleBtn.innerHTML = 'HIDE POST TITLES';
        } else {
            info.style.display = 'none';
            this._infoVisible = true;
            this._toggleBtn.innerHTML = 'SHOW POST TITLES';
        }
    }
    _showInfo() {
        this._render();
    }
}
customElements.define('show-hide', ShowHide);