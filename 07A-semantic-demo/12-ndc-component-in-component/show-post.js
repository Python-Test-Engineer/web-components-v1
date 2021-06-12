class ShowPost extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({
         mode: 'open'
      });
   }
   connectedCallback() {
      // When component is added to DOM
      let rnd = Math.floor(Math.random() * 10000);
      this.shadowRoot.innerHTML = `
      <style>
          #info {
            border: 2px solid black;
            border-radius: 10px;
            padding:20px;
            margin-bottom:20px;
            background: #2196f3;
            font-family: inherit;
          }  
      </style>
      <div id="info">${this.getAttribute('message')} ${rnd}</div>
  `;
   }
   disconnectedCallback() {
      // when component is removed from DOM
   }
}
customElements.define('show-post', ShowPost);