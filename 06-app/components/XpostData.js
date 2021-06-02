const template = document.createElement('template');
template.innerHTML = `
		<style>
			input {
				font-size: var(--main-font-size, 20px);
				padding: 5px 10px;
				border: 2px solid var(--primary, black);
				border-radius:5px;
			}
			button {
				margin: 5px;
				width: 250px;
				font-size: 18px;
				background-color: var(--primary, black);
				color: white;
				padding: 5px 10px;
				outline: var(--primary, black);
				border-radius: 5px;
				cursor: pointer;
			}
			button:hover {
				color: var(--hover, white);
				outline: var(--primary, black);
			}
		</style>
    <div class="container">
        <h1>LOGIN FORM</h1>
        <p>Uses a WordPress REST API to check login details and returns a success/fail message with UserId and JSON WEB TOKEN.</p>
        <p>Use any valid email address and password of 5 characters or more.</p>
        <p>Generates a JWT based on these credentials.</p>
        <p><span class="req">*</span> denotes required</p>
        <!-- ********************************************  FORM ***********************************  -->
        <form id="myForm">
            <div>
                <label>Email</label><span class="req">*</span> <span id="errEmail"></span><br>
                <input id="email" class="input-initial" type="text" name="email"  placeholder="email" >
            </div>
            <div>  
                <label>Password</label><span class="req">*</span> <span id="errPassword"></span><br>
                <input id="password" class="input-initial" type="password" name="password" placeholder="Password" >
            </div>
            <div>  
                <button id="btnSubmit" name="btnSubmit"  >SEND</button>
                <div id="formMessage"  style="word-break:break-all"></div>
            </div>    
        </form>
    </div><!-- end container -->
    `;
class WPLogin extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.btn = this.shadowRoot.getElementById('btnSubmit');
		this.btn.addEventListener('click', event => this.sendForm(event));
	}
	disconnectedCallback() {
		this.btn.removeEventListener('click', this.btnClick);
	}
	sendForm(event) {
		event.preventDefault(); // prevent default submission
		const formMessage = this.shadowRoot.getElementById('formMessage');
		const email = this.shadowRoot.getElementById('email').value;
		const password = this.shadowRoot.getElementById('password').value;
		console.log('EMAIL:', email, 'PASSWORD:', password);
		// As the API is in WordPress and expects a form, we use FormData() rather than send JSON
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		// API CALL
		let apiUrl = 'https://wp-html.co.uk/api/wp-json/api/v1/login';
		console.log('url: ' + apiUrl);
		fetch(apiUrl, {
			method: 'POST',
			body: formData,
			// use FormData object as it is going to PHP so don't need to add content-type headers
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.dispatchEvent(
					new CustomEvent('contactform', {
						detail: data,
						bubbles: true, // by default Web Components do not bubble events unlike regular DOM events
						composed: true, // this is needed to escape the Shadow DOM encapsulation and be heard by the Light DOM
					}),
				);

				console.log(data.token);
				//window.location.href = "https://49 plus.co.uk/abob/";

				formMessage.innerHTML = `JWT: ${data.token}`;
			})
			.finally(function () {});
	}
}
// DEFINE CUSTOM ELEMENT
customElements.define('wp-login', WPLogin);
