class ProfileCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({
			mode: 'open',
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

	// To save resources, props are not monitored by default.
	// We need to set monitoring...
	static get observedAttributes() {
		return ['postid', 'posttitle', 'author', 'content'];
	}

	// Responds to a setAttribute('postitle', newValue)
	// On load prop == null so oldValue == null
	// Page load will cause attributeChangedCallback unless  && oldValue!= null added
	attributeChangedCallback(attributeName, oldValue, newValue) {
		console.log(`attributeName: ${attributeName}, oldValue: ${oldValue}, newvalue: ${newValue}`);
		if (attributeName === 'posttitle' && oldValue != null) {
			// DO SOMETHING
		}
	}

	connectedCallback() {
		// Demo of Component setting attributes on itself

		const lightComponent = document.querySelector('profile-card');
		lightComponent.setAttribute('test', 'YES');

		// NB We could also set attribute of another component from this component by getting document.querySelector('another-component')
	}
}
customElements.define('profile-card', ProfileCard);
