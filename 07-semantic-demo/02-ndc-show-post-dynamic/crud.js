class CRUD extends HTMLElement {
    constructor() {
        super();

        //this._arrayPosts = [];
        //this._id = '';
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

        console.log("attribute has changed")
        if (oldValue === newValue) {
            return;
        }
        if (name === "url") {
            console.log(name, oldValue, newValue);
            this.Url = newValue;
            this._getPosts(this.Url);
        }
    }
    disconnectedCallback() {}
    _getPosts(url) {

        console.log("URL: " + url)

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                let i;
                let output = "<br>";
                const info = this.shadowRoot.querySelector("#info");
                info.innerHTML = "";
                //console.log(data.length);
                for (i = 0; i < data.length; i++) {
                    console.log(i);

                    output += '<div class="card">';

                    output += "PostID: " + data[i].id + "</b><br>";
                    output += "Title: " + data[i].title.rendered + "<br>";
                    output += "Author: " + data[i].authorName.toUpperCase() + "<br>";
                    output += "<p>" + data[i].content.rendered + "</p>";
                    output += `<p><a href="${data[i].id }" id="${data[i].id }">EDIT</a> | <a href="${data[i].id }" id="${data[i].id }">DELETE</a></p>`;
                    output += "</div>";
                }
                info.innerHTML += output;
            });
    }
    publicMethod(value) {
        console.log("Using " + value + " as URL.");
        const webComponent = document.querySelector('show-all-posts-url');
        webComponent.setAttribute('url', value);
    }
}

customElements.define("show-all-posts-url", CRUD);