const template = document.createElement('template');
template.innerHTML = `
    <style>
      :host {
        background:linen;
      }
      button {
        display: block;
        padding: 12px;
        width: 400px;
        font-size:1.2rem;
        color:white;
        background:#2196f3;
        cursor:pointer;
      }
    </style>
    <button id='btn'>CHILD COMPONENT ONE</button>
`;
class ChildOne extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    // true means deep clone
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const btn = this.shadowRoot.getElementById('btn');
    btn.addEventListener('click', e => {
      console.log('[CHILD ONE JS] +++++ CLICK START +++++');
      console.log(e);
      const rnd = Math.floor(Math.random() * 1000);
      const eventData = 'DATA SENT IN CUSTOM EVENT ' + rnd;
      this.shadowRoot.getElementById('btn').innerHTML = eventData;
      // ++++++++++ CUSTOM EVENTS ++++++++++
      this.dispatchEvent(
        new CustomEvent('childOneClick', {
          // We can choose the name of our event
          detail: eventData, // we can pass data - variables or objects
          bubbles: true // by default Web Components do not bubble events unlike regular DOM events
          // composed: true // this is needed to escape the Shadow DOM encapsulation and be heard by the Light DOM
        })
      );
      // ++++++++++ CUSTOM EVENTS ++++++++++
      console.log('[CHILD ONE JS] +++++ CLICK END +++++ ');
    });
  }
}
customElements.define('child-one', ChildOne);
