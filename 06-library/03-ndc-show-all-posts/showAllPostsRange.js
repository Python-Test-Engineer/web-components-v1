class ShowAllPostsRange extends HTMLElement {
    constructor() {
        super();
        this.min;
        this.max;
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
              body,h1,h2,h3,h4,h5,p,ul,ol {
                  font-size: var(--mobile-font-size, 16px);
              }
              .card {
                font-size: var(--mobile-font-size, 16px);
                color: var(--main-bg-color, orange)
              }
          }
        </style>
        <div id="info"></div>
    `;
    }
    connectedCallback() {
        //this._getPosts();
        console.log("connectedCallback...");
    }
    static get observedAttributes() {
        return ['range']; // if we add another attribute 'test' here the _getPosts() and AJAX will be fired if this attribute changes 
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        if (oldValue === newValue) {
            return;
        }
        if (name === 'range') {
            console.log("attribute RANGE has changed")
            console.log(name, oldValue, newValue);
            let json = (JSON.parse(newValue))
            if (json.max == null) {
                json.max = json.min;
            }
            this._getPosts(json.min, json.max);
        }
    }
    disconnectedCallback() {}
    _getPosts(min, max) {
        let apiUrl = "../_data/jsonplaceholderposts100.json";
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                let i;
                let output = "<br>";
                // output += "<h2>SHOW ALL POSTS IN A RANGE</h2>";
                const info = this.shadowRoot.querySelector("#info");
                info.innerHTML = "";
                for (i = min - 1; i < max; i++) {
                    //console.log(i);
                    output += '<div class="card">';
                    output += "PostID: <b>" + data[i].id + "</b><br>";
                    output += "UserID: <b>" + data[i].userId + "</b><br>";
                    output += "Title: <em>" + data[i].title + "</em><br><br>";;
                    output += data[i].body + "<br>";
                    output += "</div>";
                }
                info.innerHTML += output;
            });
    }
}
customElements.define("show-all-posts-range", ShowAllPostsRange);