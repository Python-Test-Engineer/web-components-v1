class ShowAllPostsCategory extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.innerHTML = `
        <style>
            .card {
              border: 2px solid #2196f3;
              border-radius: 10px;
              padding:20px;
              margin-bottom:20px;
              font-size: var(--main-font-size, 22px);
              word-break: break-all; 
              
            }  
                      
          @media only screen and (max-width: 767px) {

              body,h1,h2,h3,h4,h5,p,ul,ol {
                  font-size: var(--mobile-font-size, 16px);
              }
          }
        </style>
        <div id="info"></div>
    `;
  }

  connectedCallback() {
    console.log("connectedCallback...");
    this._getPosts();
  }
  static get observedAttributes() {
    return ["cat"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // this will fire initially as the element has no atrribute but is added when page runs
    console.log("attribute has changed")
    if (oldValue === newValue) {
      return;
    }
    if (name === "cat") {
      console.log(name, oldValue, newValue);
      this.cat = newValue;
      this._getPosts()
    }
  }
  disconnectedCallback() {
    console.log("disconnectedCallback...");
  }

  _getPosts() {
    let apiUrl = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts?categories=' + this.cat;
    console.log(apiUrl);

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        let i;
        let output = "<br>";
        output += "<h2>SHOW ALL POSTS FOR A CATEGORY</h2>";
        const info = this.shadowRoot.querySelector("#info");
        info.innerHTML = "";
        console.log(data.length);
        for (i = 0; i < data.length; i++) {
          console.log(i);

          output += '<div class="card">';

          output +=
            "PostID: <b>" +
            data[i].id +
            "</b><br> Title: <b>" +
            data[i].title.rendered +
            "</b> by Author ";
          output += "<b>" + data[i].authorName.toUpperCase() + "</b><br>";
          output += "<p>" + data[i].content.rendered + "</p>";
          output += "</div>";
        }
        info.innerHTML += output;
      });
  }
}

customElements.define("show-all-posts-category", ShowAllPostsCategory);