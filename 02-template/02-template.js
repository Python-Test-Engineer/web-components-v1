  // create a new template tag
  const template = document.createElement('template'); // can be any variable name like const template01 = ...
  // set the html content
  template.innerHTML = `
      <h2>Hello World from template loaded via component.</h2>
      <p>We do a deep clone with cloneNode(true)</p>
  `;
  class MyComponent extends HTMLElement {
      constructor() {
          super();
          this.appendChild(template.content.cloneNode(true)); // true means deep clone of all child elements.
      }
  }
  customElements.define('my-component', MyComponent);