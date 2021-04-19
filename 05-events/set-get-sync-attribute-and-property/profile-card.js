export class ProfileCard extends HTMLElement {
    constructor() {
        super();
        this._firstName;
        this._lastName;
        this._fullName;
        this.attachShadow({
            mode: 'open'
        });
    }
    connectedCallback() {
        // Change a property and see it reflected as an attribute
        this._fullName = this._firstName + ' ' + this._lastName;
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <img src='https://placeimg.com/100/100/people' />       
            <h1>${this._fullName}</h1>
        `;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Google warns of RE-ENTRANCY!!!
        // https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
        // if we were to set property firstName to new attribute value it would fire off SET which in
        // turn fires of atributeChangedCallback - an endless loop that gives an out of memory error.
        // if we have set attributes on component in html then we can do this.firstName = newValue;
        // and we then don't need getters and setters.
        // NB This gets fired initially as attribute is null but we set firstName and lastName in constror which tiggers the set method
        if (name === 'the-first-name') {
            //this._firstName = newValue; //endless loop
        }
        if (name === 'the-last-name') {
            // this._lastName = newValue; //endless loop
        }
        this._fullName = this._firstName + ' ' + this._lastName;
        console.log(this._fullName)
        this.render();
    }
    static get observedAttributes() {
        return ['the-first-name', 'the-last-name'];
    }
    // set  means that when we change the firstName we also change the atribute to be in sync
    set _firstName(val) {
        if (val) {
            this.setAttribute('the-first-name', val);
            console.log("firstName setter")
        } else {
            this.removeAttribute('the-first-name');
        }
    }
    // get  means if use/call firstName it uses the-first-name attribute value.
    // getters and setters make fns into properties so get firstName() === this.firstName
    get _firstName() {
        console.log("firstName getter")
        return this.getAttribute('the-first-name');
    }
    set _lastName(val) {
        if (val) {
            this.setAttribute('the-last-name', val);
            console.log("lastName setter")
        } else {
            this.removeAttribute('the-last-name');
        }
    }
    get _lastName() {
        console.log("lastName getter")
        return this.getAttribute('the-last-name');
    }
}
customElements.define('profile-card', ProfileCard);