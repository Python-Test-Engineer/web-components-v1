class ProfileCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
  }
  render() {
    this.shadowRoot.innerHTML = `
            <style>
            
            .card {
                    padding: 10px;
                    margin: 15px auto;
                    border: 2px solid orange;
                    border-radius: 10px;
                    background: #ccc;
                    box-sizing: border-box;
                    max-width: 750px;
                    font-size:32px; 
                }
               div {
                   margin:10px 0;
               }
            </style>
            <div class="card">              
                <div class="content">
                    <strong>ID: ${this.postid}</strong>
                </div>
                <div>
                    ${this.posttitle}
                </div>
                <div>
                    Authored by <em>${this.author}</em><br>
                </div>
                <div>
                    <h3 style="color:#2196f3">${this.content}</h3>
                    <p>Lorem Ipsum </p>
                </div>
            </div>  
        `;
  }
  static get observedAttributes() {
    return ['postid', 'posttitle', 'author', 'content'];
  }
  attributeChangedCallback(attributeName, oldValue, newValue) {
    console.log(
      `attributeName: ${attributeName}, oldValue: ${oldValue}, newvalue: ${newValue}`
    );
    if (attributeName === 'posttitle') {
      this.posttitle = newValue;
    }
    if (attributeName === 'postid') {
      this.postid = newValue;
    }
    if (attributeName === 'author') {
      this.author = newValue;
    }
    if (attributeName === 'content') {
      this.content = newValue;
    }
    this.render();
  }
}
customElements.define('profile-card', ProfileCard);
