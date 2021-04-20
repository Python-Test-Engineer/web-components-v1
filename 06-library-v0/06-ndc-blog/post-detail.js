class PostDetail extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
  }
  get aPost() {
    // occurs every time we output post data which is 4 x in card at bottom
    // console.log("[POST-DETAIL COMPONENT] WILL RETURN ON RENDER " + this._post.id);
    return this._post;
  }
  set aPost(value) {
    // post objects sent in Custom Event in post-list.js
    this._post = value;
    this._render();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        body {
          font-family: "Quicksand";
          box-sizing: border-box;
        }
        .card {
          max-width:90%;
          word-break: break-all;
        }
        h2 {
          margin-top:0;
          color:#2196f3;
          font-size:1.8rem;
        }
        p {
          font-size:1.4rem;
        }
      </style>
      <div class="card">
        <h2>${this.aPost.title.rendered}</h2>
        <h3>Post ID of  ${this.aPost.id}</h3>
        <h3>Authored by ${this.aPost.authorName}</h3>
        <p>${this.aPost.content.rendered}</p>
      </div>
    `;
  }
}
customElements.define('the-post', PostDetail);