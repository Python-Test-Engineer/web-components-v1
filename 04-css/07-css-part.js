customElements.define(
	'before-after-demo',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });

			this.shadowRoot.innerHTML = `
      <div part="div">Content</div>
    `;
		}
	},
);

customElements.define(
	'input-demo',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });

			this.shadowRoot.innerHTML = `
        <style>
            input {
            font-size: 24px;
            font-weight:bold;
            padding: 5px 10px;
            font-family: inherit;
            color: green;
          }
          input::placeholder {
            color: orange;
          }
        </style>
       <input type="text" placeholder="Placeholder" part="input">
    `;
		}
	},
);

customElements.define(
	'selection-demo',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });

			this.shadowRoot.innerHTML = `
      <p part="text">Select this text to see what happens.</p>
    `;
		}
	},
);

customElements.define(
	'line-demo',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });

			this.shadowRoot.innerHTML = `
      <p part="text">
        First line.
        <br>
        Second line.
      </p>
    `;
		}
	},
);

customElements.define(
	'letter-demo',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });

			this.shadowRoot.innerHTML = `
      <p part="text">First letter is red.</p>
    `;
		}
	},
);
