const template = document.createElement('template');
template.innerHTML = `
    <style>
      body {
        box-sizing: border-box;
      }
      button {
        display: block;
        padding: 12px;
        margin: 0 0 10px 10px;
        width:100px;
        font-size: 1.2rem;
        color:black;
        font-weight: bolder;
        background:#fff;
        cursor:pointer;
        border: 1px solid orange;
        border-radius: 15px;
        text-align:center;
        outline:none;
      }
      button:hover {
        background: #ccc;
        color:white;
        outline:none;
      }
    </style>
    <section></section>
`;
class PostList extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    // true means deep clone
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.postListElement = this.shadowRoot.querySelector('section');
  }
  get allPosts() {
    return this._arrayOfPosts;
  }
  set allPosts(value) {
    this._arrayOfPosts = value;
    console.log('post-list.js ', this._arrayOfPosts);
    this._render();
  }
  _render() {
    this._arrayOfPosts.forEach(postArray => {
      const button = document.createElement('button');
      // add id number to button display
      button.appendChild(document.createTextNode(postArray.id));
      button.addEventListener('click', (e) => {
        // we create an event and also send with it the postArray
        this.dispatchEvent(new CustomEvent('selectedPost', {
          detail: postArray
        }));
      });
      this.postListElement.appendChild(button);
    });
  }
}
customElements.define('all-posts', PostList);