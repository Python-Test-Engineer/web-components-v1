import {
   SERVER,
   Utility,

} from '../global.js';
console.log(SERVER);
console.log(Utility.getUrl());
const template = document.createElement('template');
template.innerHTML = `
   
    <!-- Form stylesheet -->
    <link href="css/webcomponent.css" rel="stylesheet">
      <div id="signupForm" style="max-width:1200px;border:2px solid #ccc;padding:20px; border-radius:10px;">
         <p><span class="req">*</span> denotes required</p>
         <form id="myForm" method="post" action="posted.php"> 
            <div>
               <label>Email</label><span class="req">*</span> <span id="errEmail"></span><br>
               <input id="email" class="w3-input  input-initial" type="text" name="email" placeholder="email" size="30">
            </div>
            <div>
               <br>
               <input id="btnSubmit" name="btnSubmit" class=""  type="button" value="LOGIN"><br><br>
               <span id="formMessage"></span>
            </div>
         </form>  
      </div>
    `;

class WPCheckEmail extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({
         mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.delay = 750;
      this.formValid = false;
      this.btn = this.shadowRoot.getElementById('btnSubmit');

      this.btn.value = "CHECK EMAIL";
      this.btn.style.backgroundColor = 'blue';
      this.btn.style.color = '#fff';
      this.btn.style.width = '200px';
      this.btn.disabled = true;
      this.btn.style.cursor = 'not-allowed';
      this.formMessage = this.shadowRoot.getElementById('formMessage');
      this.emailField = this.shadowRoot.getElementById('email');
      this.errEmail = this.shadowRoot.getElementById('errEmail');
      this.emailExists = 1;
      this.emailValid = false;

      this.output = this.shadowRoot.getElementById('output');

   }

   connectedCallback() {
      //const btn = this.shadowRoot.getElementById('btnSubmit');
      var self = this;
      // unable to remove event listeners with anonymous functions so we create
      // a named function to then remove in disconnectedCallback
      var btnClick = function (e) {
         e.preventDefault(); // prevent default submission
         //alert("Button clicked!");
         var formOK = this.emailValid;
         if (formOK) {

            console.log("VALID ");
            const formData = new FormData();

            formData.append('email', this.emailField.value);
            console.log("email sent: " + this.emailField.value);
            // API CALL 
            let apiUrl = SERVER + 'social/api/controllers/user/check-email.php'
            console.log("url: " + apiUrl);

            fetch(apiUrl, {
                  method: 'POST',
                  body: formData
                  // use FormData object so don't need to add content-type headers
               })
               .then(function (response) {

                  return response.text();
               })
               .then(function (data) {
                  console.log(data);
                  // send Custom Event to Parent that can then remove component
                  // or do something else
                  // redirect with message in querystring
                  self.dispatchEvent(new CustomEvent('contactform', {
                     detail: data,
                     bubbles: true, // by default Web Components do not bubble events unlike regular DOM events
                     composed: true // this is needed to escape the Shadow DOM encapsulation and be heard by the Light DOM
                  }));
                  console.log("CUSTOM EVENT emitted");
                  //alert(data);
                  self.showResult(data);
                  //window.location.href = "https://49 plus.co.uk/abob/";
               })
               .finally(function () {
                  self.clearFields();
               });


         } else {
            alert("!!!!! FORM NOT VALID  XXXX");
            console.log("NOT VALID");
         }

         // reuse afterDelay in the case of empty form
         // highlights empty form fields on btn click

         self.afterDelayEmailHandler();
      }
      // bind this to form not btn
      this.btn.addEventListener('click', btnClick.bind(this));

      var emailHandler = function (e) {
         //e.preventDefault(); // prevent default submission
         self.emailHandler();
      }

      this.emailField.addEventListener("keyup", emailHandler);

   };
   showResult(data) {
      //alert("SHOW");
      this.shadowRoot.getElementById('formMessage').innerHTML = `<h2>${data}</h2>`;
   }
   clearFields() {
      this.emailField.value = "";
      this.emailValid = false;
      this.btn.value = "CHECK EMAIL";
      this.btn.style.backgroundColor = 'blue';
      this.btn.style.color = '#fff';
      this.btn.style.width = '200px';
      this.btn.disabled = true;
      this.formatNeutral(this.emailField);
   }
   activateSend() {

      if (this.emailValid) {

         this.btn.classList.remove("w3-blue");
         this.btn.classList.add("w3-green");
         this.formMessage.innerHTML = "<h2>Form is now valid.</h2>";
         this.formValid = true;
         this.btn.value = "CHECK EMAIL";
         this.btn.style.backgroundColor = 'green';
         this.btn.style.color = '#fff';
         this.btn.disabled = false;
         this.btn.style.cursor = 'pointer';


      } else {

         this.btn.classList.remove("w3-green");
         this.btn.classList.add("w3-blue");
         this.formMessage.innerHTML = "<h2>Form is NOT valid.</h2>";
         this.formValid = false;
         this.btn.value = "NOT VALID";
         this.btn.style.backgroundColor = 'red';
         this.btn.style.color = '#fff';
         this.btn.disabled = true;
         this.btn.style.cursor = 'not-allowed';

      }
   }
   emailHandler() {

      const delayTime = this.delay;

      let emailTimer;
      if (this.emailField.previousValue != this.emailField.value) {
         this.immediateEmailHandler(this.emailField.value)
         clearTimeout(emailTimer)
         emailTimer = setTimeout(() => this.afterDelayEmailHandler(), delayTime)
      }
      this.emailField.previousValue = this.emailField.value
      this.activateSend();
   }

   immediateEmailHandler(val) {

      if (!/^([a-zA-Z0-9@\-\_\.]+)$/.test(val)) {
         this.formatError(this.shadowRoot.getElementById('email'))
         this.errEmail.innerHTML = "<span class='error'>Invalid characters</span>";
      } else {

         this.formatSuccess(this.shadowRoot.getElementById('email'))
         this.errEmail.innerHTML = "<span class='success'>VALID characters</span>";
      }
      this.activateSend();
   }

   afterDelayEmailHandler() {


      if (this.emailField.value.length < 5) {
         this.errEmail.innerHTML = "<span class='error'>5 or more characters</span>";
         this.formatError(this.emailField)
         this.activateSend();
         return;
      }
      this.checkEmail(this.emailField.value);

   }
   checkEmail(val) {

      var regEx = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i;

      if (!regEx.test(this.emailField.value)) {
         this.errEmail.innerHTML = "<span class='error'>NOT a valid email</span>";
         this.emailValid = false;
         this.formatError(this.emailField);

      } else {
         this.errEmail.innerHTML = "<span class='success'>Valid email</span>";
         this.emailValid = true;

         this.formatSuccess(this.emailField);
      }
      //console.log("email " + this.emailValid);
      this.activateSend();
   }


   disconnectedCallback() {
      const btn = this.shadowRoot.getElementById('btnSubmit');
      btn.removeEventListener('click', btnClick);
      const emailField = this.shadowRoot.getElementById('email');
      emailField.removeEventListener('click', this.emailHandler);
   }


   // ======= HELPER FUNCTIONS ======= 
   formatSuccess(el) {
      el.classList.remove("input-error");
      el.classList.add("input-success");
   }
   formatError(el) {
      el.classList.remove("input-success");
      el.classList.add("input-error");
   }
   formatNeutral(el) {
      el.classList.remove("input-success");
      el.classList.remove("input-error");
   }

}

// DEFINE CUSTOM ELEMENT
customElements.define('wp-check-email', WPCheckEmail);