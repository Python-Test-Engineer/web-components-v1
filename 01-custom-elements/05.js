 class WebComponentClass extends HTMLElement {
            // constructor() creates class
            // not yet part of the DOM
            constructor() {
                super(); // this is needed to inherit HTMLElement properties and is standard JavaScript
                console.log('Component created…');
                // initialise a variable. _ indicates private to component but there is no private class.
                var _temp = 'WordPress';
            }
            connectedCallback() { // this as an event when the component is attached to the DOM
                this.innerHTML = '<h1>This is my web component</h1>';
                this.innerHTML += '<p>Tag name defined on page.</p>';
                console.log('Component now part of DOM…');
            }
    }
    // We connect the custom HTML element ‘my-component’ with the class MyComponent