const template = document.createElement('template');
template.innerHTML = `
		<style>input {
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
}</style>
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
		this.attachShadow({
			mode: 'open',
		});

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.btn = this.shadowRoot.getElementById('btnSubmit');
		this.btn.addEventListener('click', event => this.sendForm(event));
	}
	sendForm(event) {
		event.preventDefault(); // prevent default submission
		const formMessage = this.shadowRoot.getElementById('formMessage');
		const email = this.shadowRoot.getElementById('email').value;
		const password = this.shadowRoot.getElementById('password').value;
		console.log(email, password);

		const formData = new FormData();
		formData.append('email', 'p@c.com');
		formData.append('password', '123456');
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
				// console.log(data.token);
				console.log('fetch', this);
				// send Custom Event to Parent that can then do something
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

	clearFields() {}
	formIsValid() {
		if (true) {
			return true;
		} else {
			return false;
		}
	}
	activateSend() {
		if (true) {
			this.formMessage.innerHTML = 'Form is now valid.';
			BTN.setBtnValid(this.btn);
		} else {
			this.formMessage.innerHTML = 'Form is NOT valid.';
			BTN.setBtnInvalid(this.btn);
		}
	}
	emailHandler() {
		this.activateSend();
	}
	immediateEmailHandler(val) {
		if (!/^([a-zA-Z0-9@\-\_\.]+)$/.test(val)) {
			UI.formatError(this.shadowRoot.getElementById('email'));
			this.errEmail.innerHTML = "<span class='error'>Invalid characters</span>";
		} else {
			UI.formatSuccess(this.shadowRoot.getElementById('email'));
			this.errEmail.innerHTML = "<span class='success'>VALID characters</span>";
		}
		this.activateSend();
	}
	afterDelayEmailHandler() {
		if (this.emailField.value.length < 5) {
			this.errEmail.innerHTML = "<span class='error'>5 or more characters</span>";
			UI.formatError(this.emailField);
			this.activateSend();
			return;
		}
		this.checkEmail(this.emailField.value);
	}
	checkEmail(val) {
		var regEx = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i;

		if (!regEx.test(this.emailField.value)) {
			this.errEmail.innerHTML = "<span class='error'>NOT a valid email.</span>";
			this.emailValid = false;
			UI.formatError(this.emailField);
		} else {
			this.errEmail.innerHTML = "<span class='success'>Valid email.</span>";
			this.emailValid = true;
			UI.formatSuccess(this.emailField);
		}
		this.activateSend();
	}
	passwordHandler() {
		const delayTime = this.delay;

		if (this.passwordField.previousValue != this.passwordField.value) {
			this.immediatePasswordHandler(this.passwordField.value);
			clearTimeout(this.passwordTimer);
			this.passwordTimer = setTimeout(() => this.afterDelayPasswordHandler(), delayTime);
		}
		this.passwordField.previousValue = this.passwordField.value;
		this.activateSend();
	}
	immediatePasswordHandler(val) {
		if (!/^([0-9a-zA-Z]+)|([0-9a-zA-Z][0-9a-zA-Z\\s]+[0-9a-zA-Z]+)$/.test(val)) {
			UI.formatError(this.shadowRoot.getElementById('password'));
			this.errPassword.innerHTML = "<span class='error'>Invalid characters</span>";
		} else {
			UI.formatSuccess(this.shadowRoot.getElementById('password'));
			this.errPassword.innerHTML = "<span class='success'>VALID characters</span>";
		}
		this.activateSend();
	}
	afterDelayPasswordHandler() {
		if (this.passwordField.value.length < 5) {
			this.errPassword.innerHTML = "<span class='error'>5 or more characters</span>";
			UI.formatError(this.passwordField);
			this.passwordValid = false;
			this.activateSend();
			return;
		}
		this.checkPassword(this.passwordField.value);
	}
	checkPassword(val) {
		//console.log("val " + val);
		let regEx = /^([0-9a-zA-Z]+)|([0-9a-zA-Z][0-9a-zA-Z\\s]+[0-9a-zA-Z]+)$/;
		if (regEx.test(val)) {
			this.errPassword.innerHTML = "<span class='success'>Password is valid.</span>";
			this.passwordValid = true;
			UI.formatSuccess(this.passwordField);
		} else {
			this.errPassword.innerHTML = "<span class='error'>Password is invalid.</span>";
			this.passwordValid = false;
			UI.formatError(this.passwordField);
		}
		this.activateSend();
	}
	disconnectedCallback() {
		this.btn.removeEventListener('click', this.btnClick);
		this.emailField.removeEventListener('click', this.emailHandlerListener);
		this.passwordField.removeEventListener('click', this.passwordHandlerListener);
	}
}
// DEFINE CUSTOM ELEMENT
customElements.define('wp-login', WPLogin);
