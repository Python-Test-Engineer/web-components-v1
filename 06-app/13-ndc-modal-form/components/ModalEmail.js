class ModalEmail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
        <style>
            #backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: rgba(0,0,0,0.75);
                z-index: 10;
                opacity: 0;
                pointer-events: none;
            }

            :host([opened]) #backdrop,
            :host([opened]) #modal {
                opacity: 1;
                pointer-events: all;
            }

            :host([opened]) #modal {
                top: 5vh;
            }

            #modal {
                position: fixed;
                top: 5vh;
                left: 25%;
                width: 50%;
                z-index: 100;
                background: white;
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                opacity: 0;
                pointer-events: none;
                transition: all 0.2s ease-out;
            }

            header {
                padding: 1rem;
                border-bottom: 1px solid #ccc;
            }

            ::slotted(h1) {
                font-size: 1.25rem;
                margin: 0;
            }

            #main {
                padding: 1rem;
            }

            #actions {
                padding: 0.5rem;
                display: flex;
                justify-content: space-between;
                aligan-items:c enter;
            }

            #actions button {
                margin: 0 0.25rem;
                background: #2196f3;
                color: white;
                padding:10px;
            }
        </style>
        <div id="backdrop"></div>
        <div id="modal">
            <header>
                <section id="actions">
                  <slot name="title">Default slot content</slot>
                  <button id="cancel-btn">CLOSE</button>
                  <!-- <button id="confirm-btn">Okay</button> -->
                </section>
            </header>
            <section id="main">
                <slot></slot>
            </section>
           
        </div>
    `;
        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange', event => {
            console.dir(slots[1].assignedNodes());
        });
        const backdrop = this.shadowRoot.querySelector('#backdrop');
        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        backdrop.addEventListener('click', this._cancel.bind(this));
        cancelButton.addEventListener('click', this._cancel.bind(this));

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }

    static get observedAttributes() {
        return ['opened'];
    }

    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if (this.hasAttribute('opened')) {
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }

    _cancel(event) {
        this.hide();
        const cancelEvent = new Event('cancel', {
            bubbles: true,
            composed: true
        });
        event.target.dispatchEvent(cancelEvent);
        // or...
        this.dispatchEvent(cancelEvent);
    }


}

customElements.define('modal-email', ModalEmail);