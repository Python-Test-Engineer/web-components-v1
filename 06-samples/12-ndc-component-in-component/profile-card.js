class ProfileCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
        <style>
        
           .card {
                padding: 30px;
                margin: 5px;
                border: 2px solid orange;
                border-radius: 10px;
                background: #ccc;
                box-sizing: border-box;
                cursor: pointer;
                text-align: center;
                width: 350px;
                display: inline-block;
            }
            h1, p {
               
                padding: 0;
              
            }
            h1 {
                font-size: 1.4rem;
                color: #2196f3;
            }
            h2 {
                color: red;
                font-style: italic;
                font-size: 1rem;
            }
            img {
                border-radius: 50%;
            }
            /* slot is a tag so it can be styled */
            slot {
                color: orange;
                font-size: 12px;
            }
            /* We can use ::slotted but needs an element but not the parent web component tag profile-card */
            ::slotted(span){
                color:white;
                font-size: 12px;
            }
        </style>
        <div class="card">
            <img src='${this.picture}' />
            <h1>${this.firstName + ' '  + this.lastName}</h1>
            <h2>${this.city}</h2>   
            <slot></slot>   
        </div>  
    `;
    }
    static get observedAttributes() {
        return ['first-name', 'last-name', 'city', 'picture'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'first-name') {
            this.firstName = newValue;
        }
        if (name === 'last-name') {
            this.lastName = newValue;
        }
        if (name === 'city') {
            this.city = newValue;
        }
        if (name === 'picture') {
            this.picture = newValue;
        }
        this.render();
    }
}
customElements.define('profile-card', ProfileCard);