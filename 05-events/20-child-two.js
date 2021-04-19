const template2 = document.createElement('template');
template2.innerHTML = `
    <style>
      button {
        display: block;
        padding: 12px;
        width: 500px;
        font-size:1.2rem;
        color:white;
        background:orange;
        cursor:pointer;
      }
     
    </style>
    <button id='btn'>COMPONENT TWO</button>
   
`;

class ChildTwo extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    // true means deep clone
    this.shadowRoot.appendChild(template2.content.cloneNode(true));
    //this.postListElement = this.shadowRoot.querySelector('section');
  }

  connectedCallback() {
    const btn = this.shadowRoot.getElementById('btn');

    btn.addEventListener('click', (e) => {
      console.log("[CHILD TWO] +++++ CLICK START +++++");
      console.log(e);
      // we create an event and also send with it the postArray
      this.dispatchEvent(new CustomEvent('childTwoClick', {
        detail: '[TWO] Child Two can trigger an event and send data to parent that can be sent to Child One by Parent -> Child communication as per previous examples - attributes or Public Method. ',
        bubbles: true,
        composed: true
      }));
      console.log("[CHILD TWO] +++++ CLICK END +++++ ");

    });
  };
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (attributeName === 'displaytext') {
      const btn = this.shadowRoot.getElementById('btn');
      btn.innerHTML = 'CHANGED BY COMPONENT ONE TO: ' + newValue;
      //alert(btn.innerHTML);
    }
  }

  static get observedAttributes() {
    return ['displaytext'];
  }
  publicMethod() {
    //alert('\npublicMethod in COMPONENT TWO fired...\n\nwe can then do many things...');
    console.log("Component TWO publicMethod fired...")
  }
}


customElements.define('child-two', ChildTwo);