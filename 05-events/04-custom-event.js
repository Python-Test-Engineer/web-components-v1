const templateItem = document.createElement('template');
templateItem.innerHTML = `
    <style>
      button {
        display: block;
        padding: 12px;
        width: 500px;
        font-size:1.2rem;
        color:white;
        background:green;
        cursor:pointer;
      }
    </style>
    <button id='btn'>CHILD COMPONENT</button>
`;
class Child extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({
			mode: 'open',
		});
		// true means deep clone
		this.shadowRoot.appendChild(templateItem.content.cloneNode(true));
		//this.postListElement = this.shadowRoot.querySelector('section');
	}
	connectedCallback() {
		const btn = this.shadowRoot.getElementById('btn');
		// We can access Light DOM from within component
		const comp = document.querySelector('child-component');
		// create a class level property to keep track of counter
		this._currentCount = 0;
		// We can get the attribute value of our web component from within the component.
		let val = parseInt(comp.getAttribute('count'));
		console.log(val);
		// regular button click event listener
		btn.addEventListener('click', e => {
			this._currentCount += 1;
			// We csan change the attrribute value from within the component
			// Remember the web component is now part of the DOM as a regular HMTL element.
			comp.setAttribute('count', this._currentCount);
			console.log('_currentCount = ' + comp.getAttribute('count'));
			this.dispatchEvent(
				new CustomEvent('childClick', {
					detail: 'Button clicked ' + this._currentCount + ' times.',
					bubbles: true, // allows it to bubble up to top of child component where it can be heard in Light DOM
					composed: true, // allows it to penetrate Shadow DOM and be heard in in tags outside of component
				}),
			);
		});
	}
	static get observedAttributes() {
		return ['count'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		// this will fire initially as the element has no atrribute but is added when page runs
		if (oldValue === newValue) {
			return;
		}
		if (name === 'count' && oldValue !== null) {
			// to access an element in component we need to include shadowRoot
			const btn = this.shadowRoot.getElementById('btn');
			btn.innerHTML = 'CHILD COMPONENT => ' + newValue;
			//console.log('[attributeChangedCallback] CHILD COMPONENT - ' + newValue + ' old value was: ' + oldValue);
		}
	}
}
customElements.define('child-component', Child);
