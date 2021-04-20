const template = document.createElement('template');
template.innerHTML = `
   
    <!-- Form stylesheet -->
    <style>
        *,
        *::after,
        *:before{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .error {
            color:red;
            font-weight:bold;
        }
        .success {
            color:green;
            font-weight:bold;
        }
        body {
            font-family: var(--main-font, 'Quicksand');
            font-size: var(--main-font-size, 28px);
        }
        input, textarea {
            padding:10px;
            font-family: var(--main-font, 'Quicksand');
            font-size: var(--main-font-size, 28px);
        }
        .input-initial{
            outline: none;
            border: 3px solid #ccc;
            border-radius: 10px;
        }

        .input-success {    
            background-color: #ffffff;
            background-image: url("https://49plus.co.uk/abob/wp-content/themes/gp-child/images/icon-tick.png");
            background-size: 35px 35px;
            background-position:right center;
            background-repeat: no-repeat;
            font-weight: bold;
            color:green;
            border: solid 3px green;
            border-radius: 10px;
        }
        .input-error {    
            background-color: #ffffff;
            background-image: url("https://49plus.co.uk/abob/wp-content/themes/gp-child/images/cross.svg");
            background-size: 35px 35px;
            background-position:right center;
            background-repeat: no-repeat;
            font-weight: bold;
            color:red;
            border: solid 3px red;
            border-radius: 10px;
        }
        form span.req, p span.req{
            display:inline;
            float:none;
            color:red !important;
            font-weight:bold;
            margin:0;
            padding:0;
          }
        /* Placeholder text in input fields */
        ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: #808080;
            font-style:italic;
            font-weight: normal;
            opacity: 1; /* Firefox */
        }

        @media only screen and (max-width: 600px) {
            body {
                font-size: 20px;
                background-color: lightblue;
            }
        }
   
</style>
    <!-- Page Container -->
    <div class="w3-container w3-content" style="max-width:1200px;">
        <!-- W3 CSS Grid -->
        <div class="w3-row">
            <div class="w3-col m12" id="signupForm">
                <h1>CONTACT FORM <span id="version" class="version"></span></h1>
                <p><span class="req">*</span> denotes required</p>

                <!-- ********************************************  FORM ***********************************  -->
                <form id="myForm" method="post" action="posted.php">
                    <table class="w3-table w3-bordered" style="background:white;" id="mainTable">
                        <!-- =============== FIRST NAME =============== -->
                        <tr>
                            <td>
                                First Name<span class="req">*</span> <span id="errFirstName"></span><br>
                                <input id="firstName" class="w3-input  input-initial" type="text" name="firstName"
                                    placeholder="First Name">

                            </td>
                        </tr>
                        <!-- =============== LAST NAME =============== -->
                        </tr>
                        <td>
                            Last Name<span class="req">*</span> <span id="errLastName"></span><br>
                            <input id="lastName" class="w3-input  input-initial" type="text" name="lastName"
                                placeholder="Last Name">

                        </td>
                        </tr>
                        <!-- code file to validate this form element -->
                        <!-- =============== EMAIL =============== -->
                        <tr>
                            <td>
                                Email<span class="req">*</span> <span id="errEmail"></span><br>
                                <input id="email" class="w3-input  input-initial" type="text" name="email"
                                    placeholder="email" size="30">

                            </td>
                        </tr>
                        <!-- code file to validate this form element -->
                        <!-- =============== MESSAGE =============== -->
                        </tr>
                        <td>
                            Message<span class="req">*</span> <span id="errMessage"></span><br>
                            <textarea id="message" class="w3-input  input-initial" type="text" name="message"
                                placeholder="Message" rows="4" cols="30"></textarea>

                        </td>
                        </tr>
                        <!-- code file to validate this form element -->

                        <tr>
                            <td>
                                <input id="btnSubmit" name="btnSubmit" class=""
                                    type="button" value="SEND FORM"><br><br>
                                <span id="formMessage"></span>
                            </td>
                        </tr>
                    </table>
                </form>
                <div id="output"></div>
                <!-- ======================== END OF FORM =====================================================-->
            </div><!-- end col12 -->
        </div><!-- end row -->
    </div><!-- end container -->
   
    
    `;

class WPContactLive extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.delay = 750;
        this.formValid = false;
        this.btn = this.shadowRoot.getElementById('btnSubmit');

        this.btn.value = "NOT VALID";
        this.btn.style.backgroundColor = 'red';
        this.btn.style.color = '#fff';
        this.btn.style.width = '200px';
        this.btn.disabled = true;
        this.btn.style.cursor = 'not-allowed';
        this.formMessage = this.shadowRoot.getElementById('formMessage');
        this.emailField = this.shadowRoot.getElementById('email');
        this.errEmail = this.shadowRoot.getElementById('errEmail');
        this.emailExists = 1;
        this.emailValid = false;
        this.firstNameField = this.shadowRoot.getElementById('firstName');
        this.errFirstName = this.shadowRoot.getElementById('errFirstName');
        this.firstNameValid = false;
        this.lastNameField = this.shadowRoot.getElementById('lastName');
        this.errLastName = this.shadowRoot.getElementById('errLastName');
        this.lastNameValid = false;
        this.messageField = this.shadowRoot.getElementById('message');
        this.errMessage = this.shadowRoot.getElementById('errMessage');
        this.messageValid = false;
        this.output = this.shadowRoot.getElementById('output');

    }

    connectedCallback() {
        //const btn = this.shadowRoot.getElementById('btnSubmit');
        var self = this;
        // unable to remove event listeners with anonymous functions so we create
        // a named function to then remove in disconnectedCallback
        var btnClick = function (e) {
            e.preventDefault(); // prevent default submission
            var formOK = this.emailValid && this.firstNameValid && this.lastNameValid && this.messageValid;
            if (formOK) {
                //alert("FORM IS VALID ----> CLICK");
                //console.log("VALID - ALERT");
                const formData = new FormData();
                formData.append('firstname', this.firstNameField.value);
                formData.append('lastname', this.lastNameField.value);
                formData.append('email', this.emailField.value);
                formData.append('message', this.messageField.value);

                // API CALL 

                let apiUrl = 'https://49plus.co.uk/abob/wp-json/owt/v1/contactform';
                console.log("url: " + apiUrl);

                fetch(apiUrl, {
                        method: 'POST',
                        body: formData
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
                        //window.location.href = "https://49 plus.co.uk/abob/";
                    });


            } else {
                alert("!!!!! FORM NOT VALID  XXXX");
                //console.log("NOT VALID");
            }

            // reuse afterDelay in the case of empty form
            // highlights empty form fields on btn click
            self.afterDelayFirstNameHandler();
            self.afterDelayLastNameHandler();
            self.afterDelayMessageHandler();
            self.afterDelayEmailHandler();


        }
        // bind this to form not btn
        this.btn.addEventListener('click', btnClick.bind(this));

        var emailHandler = function (e) {
            //e.preventDefault(); // prevent default submission
            self.emailHandler();
        }

        this.emailField.addEventListener("keyup", emailHandler);
        var firstNameHandler = function (e) {
            //e.preventDefault(); // prevent default submission
            self.firstNameHandler();
        }
        this.firstNameField.addEventListener("keyup", firstNameHandler);
        var lastNameHandler = function (e) {
            //e.preventDefault(); // prevent default submission
            self.lastNameHandler();
        }
        this.lastNameField.addEventListener("keyup", lastNameHandler);
        var messageHandler = function (e) {
            //e.preventDefault(); // prevent default submission
            self.messageHandler();
        }
        this.messageField.addEventListener("keyup", messageHandler)


    };
    activateSend() {

        if (this.emailValid && this.firstNameValid && this.lastNameValid && this.messageValid) {

            this.btn.classList.remove("w3-blue");
            this.btn.classList.add("w3-green");
            this.formMessage.innerHTML = "Form is now valid.";
            this.formValid = true;
            this.btn.value = "SEND";
            this.btn.style.backgroundColor = 'green';
            this.btn.style.color = '#fff';
            this.btn.disabled = false;
            this.btn.style.cursor = 'pointer';


        } else {

            this.btn.classList.remove("w3-green");
            this.btn.classList.add("w3-blue");
            this.formMessage.innerHTML = "Form is NOT valid.";
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

        // if (this.emailField.value.length >= 5 ) {
        //     // API

        //     const url =  'https://wpjs.co.uk/app/email-exists';

        //     let formData = new FormData();
        //     formData.append('email', this.emailField.value);    
        //     let emailAvailable;

        //     const checkEmailAvailable = async () => {
        //         const response = await fetch(url, {
        //             method: 'POST', 
        //             body: formData,
        //             headers: new Headers({
        //                  'Cache': 'no-store'
        //             })
        //         });
        //         const data = await response.text();
        //         //console.log(data);
        //         emailAvailable = data;
        //         //console.log("emailAvailable: " + emailAvailable)
        //         this.checkEmail(emailAvailable);
        //     }         
        //   checkEmailAvailable();           
        // }

    }
    checkEmail(val) {

        var regEx = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i;

        // if (val == 1 && regEx.test(this.emailField.value)) {
        //     this.errEmail.innerHTML = "<span class='error'>" + this.emailField.value + " is valid but is in use -  " + this.emailExists + " </span>";
        //     this.emailValid = false;
        //     this.formatError(this.emailField);
        // } else if (val == 0 && regEx.test(this.emailField.value)) {
        //     this.errEmail.innerHTML = "<span class='success'>" + this.emailField.value + " free and valid " + this.emailExists + " </span>";
        //     this.emailValid = true;
        //     console.log("email " + this.emailValid);

        //     this.formatSuccess(this.emailField)
        // }
        if (!regEx.test(this.emailField.value)) {
            this.errEmail.innerHTML = "<span class='error'>INVALID email.</span>";
            this.emailValid = false;
            this.formatError(this.emailField);

        } else {
            this.errEmail.innerHTML = "<span class='success'>VALID email.</span>";
            this.emailValid = true;

            this.formatSuccess(this.emailField);
        }
        //console.log("email " + this.emailValid);
        this.activateSend();
    }
    firstNameHandler() {

        const delayTime = this.delay;

        let firstNameTimer;
        if (this.firstNameField.previousValue != this.firstNameField.value) {
            this.immediateFirstNamelHandler(this.firstNameField.value)
            clearTimeout(firstNameTimer)
            firstNameTimer = setTimeout(() => this.afterDelayFirstNameHandler(), delayTime)
        }
        this.firstNameField.previousValue = this.firstNameField.value
        this.activateSend();
    }

    immediateFirstNamelHandler(val) {

        if (!/^([a-zA-Z]+)$/.test(val)) {
            this.formatError(this.shadowRoot.getElementById('firstName'))
            this.errFirstName.innerHTML = "<span class='error'>Invalid characters</span>";
        } else {

            this.formatSuccess(this.shadowRoot.getElementById('firstName'))
            this.errFirstName.innerHTML = "<span class='success'>VALID characters</span>";
        }
        this.activateSend();
    }

    afterDelayFirstNameHandler() {

        if (this.firstNameField.value.length < 2) {
            this.errFirstName.innerHTML = "<span class='error'>2 or more characters</span>";
            this.formatError(this.firstNameField)
            this.firstNameValid = false;
            this.activateSend();
            return;
        }
        this.checkFirstName(this.firstNameField.value);
        this.activateSend();

    }

    checkFirstName(val) {
        //console.log("val " + val);

        let regEx = /^([a-zA-Z]+)$/;

        if (regEx.test(val)) {
            this.errFirstName.innerHTML = "<span class='success'>valid.</span>";
            this.firstNameValid = true;
            this.formatSuccess(this.firstNameField)
        } else {
            this.errFirstName.innerHTML = "<span class='error'>invalid.</span>";
            this.firstNameValid = false;
            this.formatError(this.firstNameField)
        }
        this.activateSend();
    }

    lastNameHandler() {

        const delayTime = this.delay;

        let lastNameTimer;
        if (this.lastNameField.previousValue != this.lastNameField.value) {
            this.immediateLastNamelHandler(this.lastNameField.value)
            clearTimeout(lastNameTimer)
            lastNameTimer = setTimeout(() => this.afterDelayLastNameHandler(), delayTime)
        }
        this.lastNameField.previousValue = this.lastNameField.value
        this.activateSend();
    }

    immediateLastNamelHandler(val) {

        if (!/^([a-zA-Z]+)$/.test(val)) {
            this.formatError(this.shadowRoot.getElementById('lastName'))
            this.errLastName.innerHTML = "<span class='error'>Invalid characters</span>";
        } else {

            this.formatSuccess(this.shadowRoot.getElementById('lastName'))
            this.errLastName.innerHTML = "<span class='success'>VALID characters</span>";
        }
        this.activateSend();
    }

    afterDelayLastNameHandler() {

        if (this.lastNameField.value.length < 2) {
            this.errLastName.innerHTML = "<span class='error'>2 or more characters</span>";
            this.formatError(this.lastNameField)
            this.lastNameValid = false;
            this.activateSend();
            return;
        }
        this.checkLastName(this.lastNameField.value);
        this.activateSend();
    }

    checkLastName(val) {
        //console.log("val " + val);

        let regEx = /^([a-zA-Z]+)$/;

        if (regEx.test(val)) {
            this.errLastName.innerHTML = "<span class='success'>valid.</span>";
            this.lastNameValid = true;
            this.formatSuccess(this.lastNameField)
        } else {
            this.errLastName.innerHTML = "<span class='error'>invalid.</span>";
            this.lastNameValid = false;
            this.formatError(this.lastNameField)
        }
        this.activateSend();
    }

    messageHandler() {

        const delayTime = this.delay;

        let messageTimer;
        if (this.messageField.previousValue != this.messageField.value) {
            this.immediateMessagelHandler(this.messageField.value)
            clearTimeout(messageTimer)
            messageTimer = setTimeout(() => this.afterDelayMessageHandler(), delayTime)
        }
        this.messageField.previousValue = this.messageField.value;
        this.activateSend();
    }

    immediateMessagelHandler(val) {

        if (!/^([0-9a-zA-Z]+)|([0-9a-zA-Z][0-9a-zA-Z\\s]+[0-9a-zA-Z]+)$/.test(val)) {
            this.formatError(this.shadowRoot.getElementById('message'))
            this.errMessage.innerHTML = "<span class='error'>Invalid characters</span>";
        } else {

            this.formatSuccess(this.shadowRoot.getElementById('message'))
            this.errMessage.innerHTML = "<span class='success'>VALID characters</span>";
        }
        this.activateSend();
    }

    afterDelayMessageHandler() {

        if (this.messageField.value.length < 5) {
            this.errMessage.innerHTML = "<span class='error'>5 or more characters</span>";
            this.formatError(this.messageField)
            this.messageValid = false;
            this.activateSend();
            return;
        }
        this.checkMessage(this.messageField.value);

    }

    checkMessage(val) {
        //console.log("val " + val);

        let regEx = /^([0-9a-zA-Z]+)|([0-9a-zA-Z][0-9a-zA-Z\\s]+[0-9a-zA-Z]+)$/;

        if (regEx.test(val)) {
            this.errMessage.innerHTML = "<span class='success'>Message is valid.</span>";
            this.messageValid = true;

            this.formatSuccess(this.messageField)
        } else {
            this.errMessage.innerHTML = "<span class='error'>Message is invalid.</span>";
            this.messageValid = false;

            this.formatError(this.messageField)
        }
        this.activateSend();
    }
    disconnectedCallback() {
        const btn = this.shadowRoot.getElementById('btnSubmit');
        btn.removeEventListener('click', btnClick);
        const emailField = this.shadowRoot.getElementById('email');
        emailField.removeEventListener('click', this.emailHandler);
        const firstNameField = this.shadowRoot.getElementById('firstName');
        firstNameField.removeEventListener('click', firstNameHandler);
        const lastNameField = this.shadowRoot.getElementById('lastNameHandler');
        lastNameField.removeEventListener('click', lastNameValid);
        const messageField = this.shadowRoot.getElementById('message');
        messageField.removeEventListener('click', messageHandler);
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
customElements.define('wp-contact-live', WPContactLive);