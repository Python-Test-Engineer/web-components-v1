class MyComponent extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
        <style>
            div {
              background: linen;
              width: 500px;
              padding:20px;
              margin-left:50px;
              border: 3px solid black;
              border-radius:15px;
            }
            ::slotted(.highlight) {
              border-bottom: 5px dotted red;
            }
            ::slotted(.title) {
              color: green;
              font-size:22px;
            }
         
        </style>
        <div>
          <slot>Some default</slot>
        </div>
       
      
    `;
	}

	connectedCallback() {}
}

customElements.define('my-component', MyComponent);
