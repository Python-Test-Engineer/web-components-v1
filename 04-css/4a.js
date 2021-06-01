class MyComponent extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
        <style>
            ::slotted(.highlight) {
              border-bottom: 5px dotted red;
            }
            div {
              background: linen;
              width: 300px;
              padding:20px;
              margin-left:50px;
              border: 3px solid black;
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
