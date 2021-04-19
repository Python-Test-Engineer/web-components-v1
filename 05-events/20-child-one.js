const template = document.createElement('template');
template.innerHTML = `
    <style>
      button {
        display: block;
        padding: 12px;
        width: 500px;
        font-size:1.2rem;
        color:white;
        background:#2196f3;
        cursor:pointer;
      }
    </style>
    <button id='btn'>COMPONENT ONE</button>
`;
class ChildOne extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    // true means deep clone
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // this.postListElement = this.shadowRoot.querySelector('section');
  }
  connectedCallback() {
    // We access elements in the shadow root using 'this.shadowRoot.<selector>'
    const btn = this.shadowRoot.getElementById('btn');
    btn.addEventListener('click', (e) => {
      console.log("[CHILD ONE] +++++ CLICK START +++++");
      console.log(e);
      // we create an event and also send with it the postArray
      this.dispatchEvent(new CustomEvent('childOneClick', {
        detail: '[ONE] Child One can trigger an event and send data to parent that can be sent to Child Two by Parent -> Child communication as per previous examples - attributes or Public Method. <br><br>Properties are Not changed by Public Properties but by attribute change.',
        bubbles: true,
        composed: true
      }));
      // const componentTwo = document.querySelector('child-two');
      // componentTwo.publicMethod();

      console.log("[CHILD ONE] +++++ CLICK END +++++ ");
    });
  };
}
customElements.define('child-one', ChildOne);