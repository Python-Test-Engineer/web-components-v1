class ShowAllPostsUrl extends HTMLElement {
    constructor() {
        super();
        //this._arrayPosts = [];
        //this._id = '';
        this.url;
        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.innerHTML = `
          <style>
              .card {
                border: 2px solid black;
                border-radius: 10px;
                padding:20px;
                margin-bottom:20px;
                font-size: var(--main-font-size, 22px);
              }  
            @media only screen and (max-width: 767px) {             
                .card {
                    border: 2px solid red;
                    border-radius: 10px;
                    padding:20px;
                    margin-bottom:20px;
                    font-size: var(--mobile-font-size, 18px);
                    color: red;
                    word-break: break-all;
                }  
            }
          </style>
          <div id="info"></div>
      `;
    }
    connectedCallback() {}
    static get observedAttributes() {
        return ["url"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        // this runs before connectedCallback so this_getPosts is fired here not in 
        // connectedCallback

        if (oldValue === newValue) {
            console.log("NULL attribute has changed")
            console.log("attribute=" + name, "oldValue=" + oldValue, "newValue=" + newValue);
            return;
        }
        if (name === "url") { //  && oldValue !== null will not set initial value from LIGHT DOM
            console.log("url attribute has changed")
            console.log("attribute=" + name, "oldValue=" + oldValue, "newValue=" + newValue);
            this.Url = newValue;
            this._getPosts(this.Url);
        }
    }
    disconnectedCallback() {}
    _getPosts(url) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let i;
                let output = "<br>";
                output += `<h2>SHOW ALL POSTS FOR A URL</h2><h2>${url}</h2>`;
                const info = this.shadowRoot.querySelector("#info");
                info.innerHTML = "";
                //console.log(data.length);
                for (i = 0; i < data.length; i++) {
                    //console.log(i);
                    output += '<div class="card">';
                    output += "PostID: <b>" + data[i].id + "</b><br>";
                    output += "Title: <b>" + data[i].title.rendered + "</b><br>";
                    //output += "Author: " + data[i].author + "<br>";
                    output += "<p>" + data[i].content.rendered + "</p>";
                    output += "</div>";
                }
                info.innerHTML += output;
            });
    }
    publicMethod(value) {
        alert("Using " + value + " as URL.");
        const webComponent = document.querySelector('show-all-posts-url');
        webComponent.setAttribute('url', value);
    }
}
customElements.define("show-all-posts-url", ShowAllPostsUrl);