import { SERVER, Utility, UI, BTN } from '../00-ndc-global/global.js';

const template = document.createElement('template');
template.innerHTML = `
    <link href="../_css/webcomponent-form.css" rel="stylesheet">
    <div class="container">
        <h1>LOGIN FORM</h1>
        <p>Uses a WordPress REST API to check login details and returns a success/fail message with UserId and JSON WEB TOKEN.</p>
        <p>Use email: <b>demo2@49plus.co.uk</b> and password: <b>demo2</b></p>
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
                <input id="btnSubmit" name="btnSubmit" type="button" ><br><br>
                <div id="formMessage"></div>
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
		this.delay = 750;
		// this.formValid = false;
		this.btn = this.shadowRoot.getElementById('btnSubmit');
		this.btnClick;
		BTN.setBtnInitial(this.btn);
		// form message
		this.formMessage = this.shadowRoot.getElementById('formMessage');
		// emai,
		this.emailField = this.shadowRoot.getElementById('email');
		this.errEmail = this.shadowRoot.getElementById('errEmail');
		this.emailExists = 1; // if ajax email exists being used
		this.emailValid = false;
		this.emailHandlerListener; // so we can remove in disconnectedCallback lifecycle event
		this.emailTimer; // so we can remove in disconnectedCallback lifecycle event
		// password
		this.passwordField = this.shadowRoot.getElementById('password');
		this.errPassword = this.shadowRoot.getElementById('errPassword');
		this.passwordValid = false;
		this.passwordHandlerListener; // so we can remove in disconnectedCallback lifecycle event
		this.passwordTimer; // so we can remove in disconnectedCallback lifecycle event
	}
	connectedCallback() {
		var self = this;
		// unable to remove event listeners with anonymous functions so we create
		// a named function to then remove in disconnectedCallback
		this.btnClick = function (e) {
			e.preventDefault(); // prevent default submission

			if (this.formIsValid()) {
				console.log('VALID ');
				const formData = new FormData();
				formData.append('email', this.emailField.value);
				formData.append('password', this.passwordField.value);
				// API CALL
				let url = 'https://wp-html.co.uk/api/wp-json/api/v1/login';
				console.log(`%cURL: ${url}`, 'color:green;font-size:18px');
				fetch(url, {
					method: 'POST',
					body: formData,
					// use FormData object as it is going to PHP so don't need to add content-type headers
				})
					.then(function (response) {
						return response.json();
					})
					.then(function (data) {
						console.log(data);

						// send Custom Event to Parent that can then do something
						self.dispatchEvent(
							new CustomEvent('contactform', {
								detail: data,
								bubbles: true, // by default Web Components do not bubble events unlike regular DOM events
								composed: true, // this is needed to escape the Shadow DOM encapsulation and be heard by the Light DOM
							}),
						);
						// display in component
						self.showResult(data.token);
						console.log('JWT = ' + data.token);
						console.log('CUSTOM EVENT emitted');
						//window.location.href = "https://49 plus.co.uk/abob/";
					})
					.finally(function () {
						self.clearFields();
					});
			} else {
				alert('!!!!! FORM NOT VALID  XXXX');
				console.log('NOT VALID');
			}
			// reuse afterDelay in the case of empty form
			// highlights empty form fields on btn click
			self.afterDelayPasswordHandler();
			self.afterDelayEmailHandler();
		};
		// bind this to form not btn
		this.btn.addEventListener('click', this.btnClick.bind(this));
		// We cannot remove anonymous event liteneres in disconnectedCallback
		// so we create named listeners to do so.
		this.emailHandlerListener = function (e) {
			self.emailHandler();
		};
		this.emailField.addEventListener('keyup', this.emailHandlerListener);
		this.passwordHandlerListener = function (e) {
			self.passwordHandler();
		};
		this.passwordField.addEventListener('keyup', this.passwordHandlerListener);
	}
	showResult(data) {
		this.formMessage.innerHTML = `JWT: ${data}`;
	}
	clearFields() {
		this.emailField.value = '';
		this.passwordField.value = '';
		this.errEmail.innerHTML = '';
		this.errPassword.innerHTML = '';
		BTN.setBtnInitial(this.btn);
		UI.formatNeutral(this.emailField);
		UI.formatNeutral(this.passwordField);
	}
	formIsValid() {
		if (this.emailValid && this.passwordValid) {
			return true;
		} else {
			return false;
		}
	}
	activateSend() {
		if (this.formIsValid()) {
			this.formMessage.innerHTML = 'Form is now valid.';
			BTN.setBtnValid(this.btn);
		} else {
			this.formMessage.innerHTML = 'Form is NOT valid.';
			BTN.setBtnInvalid(this.btn);
		}
	}
	emailHandler() {
		const delayTime = this.delay;

		if (this.emailField.previousValue != this.emailField.value) {
			this.immediateEmailHandler(this.emailField.value);
			clearTimeout(this.emailTimer);
			this.emailTimer = setTimeout(() => this.afterDelayEmailHandler(), delayTime);
		}
		this.emailField.previousValue = this.emailField.value;
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
