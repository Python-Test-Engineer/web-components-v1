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
                    font-size:22px; 
                }
               div {
                   margin:10px 0;
               }
            </style>
            <div class="card">              
               <div class="content"><strong>${this.postid} ${this.posttitle}</strong></div>
               <div>Authored by <em>${this.author}</em><br></div>
               <div>${this.content}</div>
             
            </div>  
        `;
    }
    static get observedAttributes() {
        return ['postid', 'posttitle', 'author', 'content'];
    }
    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'posttitle') {
            this.posttitle = newValue;
        }
        if (name === 'postid') {
            this.postid = newValue;
        }
        if (name === 'author') {
            this.author = newValue;
        }
        if (name === 'content') {
            this.content = newValue;
        }
        this.render();
    }
}
customElements.define('profile-card', ProfileCard);