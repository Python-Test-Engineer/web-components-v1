import {
    SERVER,
    Utility,
    UI,
    BTN
} from './global.js';


const template = document.createElement('template');
template.innerHTML = `
    <link href="../_css/webcomponent-form.css" rel="stylesheet">
    <div class="container">
        <h1>UPDATE POST</h1>
        <p style="word-break:break-all;">https://49plus.co.uk/social/api/controllers/user/change-title.php</p>
      
        <p><span class="req">*</span> denotes required</p>
        <!-- ********************************************  FORM ***********************************  -->
        <form id="myForm">
            <div>  
                <label>Title</label><span class="req">*</span> <span id="titleError"></span><br>
                <input id="title" class="input-initial" type="text" name="title" placeholder="Enter new title here..." >
            </div>
            <div>  
           <input id="btnSubmit" name="btnSubmit" type="button" ><br><br>
                <div id="formMessage"></div>
            </div>    
        </form>
    </div><!-- end container -->
    `;
class WPUpdate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.delay = 750;

        this.btn = this.shadowRoot.getElementById('btnSubmit');
        this.btnClick;
        BTN.setBtnInitial(this.btn);

        // form message
        this.formMessage = this.shadowRoot.getElementById('formMessage');

        // title
        this.titleField = this.shadowRoot.getElementById('title');
        this.titleError = this.shadowRoot.getElementById('titleError');
        this.titleValid = false;
        this.titleHandlerListener;
        this.titleRegEx = /^([\sa-zA-Z0-9@\-\_\.]+)$/;

    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === "postid") {}
    }
    connectedCallback() {
        var self = this;
        // wp-update is a shadow root in a shadow root of another web component
        // once rendered to DOM the tree is flattened so wp-update can access the 'parent' component as if everything is Light DOM


        // unable to remove event listeners with anonymous functions so we create
        // a named function to then remove in disconnectedCallback
        this.btnClick = function (e) {
            e.preventDefault(); // prevent default submission

            if (this.formIsValid()) {
                //console.log("VALID ");
                const formData = new FormData();

                formData.append('title', this.titleField.value);
                formData.append('id', self.getPostID());
                console.log("FORM PostID=" + self.getPostID());

                // API CALL 
                let apiUrl = 'https://49plus.co.uk/social/api/controllers/post/change-field.php';
                //console.log("url: " + apiUrl);
                fetch(apiUrl, {
                        method: 'POST',
                        body: formData
                        // use FormData object as it is going to PHP so don't need to add content-type headers
                    })
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (data) {
                        //console.log(data);

                        // send Custom Event to Parent that can then do something
                        self.dispatchEvent(new CustomEvent('contactform', {
                            detail: data,
                            bubbles: true, // by default Web Components do not bubble events unlike regular DOM events
                            composed: true // this is needed to escape the Shadow DOM encapsulation and be heard by the Light DOM
                        }));
                        // display fetch response in this component
                        self.showResult(data);
                        // get post id of <show-post/> and refresh post
                        self.refreshShowPost(self.getPostID());
                    })
                    .finally(function () {
                        // clear edit fields and set field format to initial format
                        self.clearFields();
                    });
            } else {
                // not used as button disabled until form is valid
                alert("!!!!! FORM NOT VALID  XXXX");
                //console.log("NOT VALID");
            }
            // reuse afterDelay in the case of empty form
            // highlights empty form fields on btn click
            self.titleAfterDelayHandler();

        }
        // bind this to form not btn
        this.btn.addEventListener('click', this.btnClick.bind(this));
        // We cannot remove anonymous event liteneres in disconnectedCallback
        // so we create named listeners to do so.

        this.titleHandlerListener = function (e) {
            self.titleHandler();
        }
        this.titleField.addEventListener("keyup", this.titleHandlerListener)
    };
    setField(val) {
        //console.log("Set field value = " + val);
        this.titleField.value = val;
    }
    getPostID() {
        // even though we are in a shadow dom in a shadow dom of show-post
        // we can access any element in the document as the tree is flattened
        // once rendered.
        // We find the id of <show-post> so we can reset the postid to its
        // same value to refresh the post data.
        const postComponent = document.querySelector('show-post');
        const id = postComponent.getAttribute('postid');
        return id;
    }
    showResult(data) {
        this.formMessage.innerHTML = `${data}`;
    }
    refreshShowPost(id) {
        const postComponent = document.querySelector('show-post');
        //console.log(postComponent)
        console.log("Post refereshed...");
        postComponent.setAttribute('postid', id) //temp
    }
    clearFields() {
        BTN.setBtnInitial(this.btn);
        this.titleField.value = "";
        UI.formatNeutral(this.titleField);
        this.titleError.innerHTML = "";
    }
    clearFormMessage() {
        this.formMessage.innerHTML = "";
    }
    formIsValid() {
        if (this.titleValid) {
            return true;
        } else {
            return false;
        }
    }
    activateSend() {
        if (this.formIsValid()) {
            this.formMessage.innerHTML = "Form is now valid.";
            BTN.setBtnValid(this.btn);
        } else {
            this.formMessage.innerHTML = "Form is NOT valid.";
            BTN.setBtnInvalid(this.btn);
        }
    }
    titleHandler() {
        const delayTime = this.delay;
        let titleTimer;
        if (this.titleField.previousValue != this.titleField.value) {
            this.titleImmediateHandler(this.titleField.value)
            clearTimeout(titleTimer)
            titleTimer = setTimeout(() => this.titleAfterDelayHandler(), delayTime)
        }
        this.titleField.previousValue = this.titleField.value;
        this.activateSend();
    }
    titleImmediateHandler(val) {

        if (!this.titleRegEx.test(val)) {
            UI.formatError(this.shadowRoot.getElementById('title'))
            this.titleError.innerHTML = "<span class='error'>Invalid characters</span>";
        } else {
            UI.formatSuccess(this.shadowRoot.getElementById('title'))
            this.titleError.innerHTML = "<span class='success'>VALID characters</span>";
        }
        this.activateSend();
    }
    titleAfterDelayHandler() {
        if (this.titleField.value.length < 5) {
            this.titleError.innerHTML = "<span class='error'>5 or more characters</span>";
            UI.formatError(this.titleField)
            this.titleValid = false;
            this.activateSend();
            return;
        }
        this.checktitle(this.titleField.value);
    }
    checktitle(val) {
        //console.log("val " + val);

        if (this.titleRegEx.test(val)) {
            this.titleError.innerHTML = "<span class='success'> VALID</span>";
            this.titleValid = true;
            UI.formatSuccess(this.titleField)
        } else {
            this.titleError.innerHTML = "<span class='error'> INVALID</span>";
            this.titleValid = false;
            UI.formatError(this.titleField)
        }
        this.activateSend();
    }

    disconnectedCallback() {
        this.btn.removeEventListener('click', this.btnClick);
        this.titleField.removeEventListener('click', this.titleHandlerListener);
    }

}
// DEFINE CUSTOM ELEMENT
customElements.define('wp-update', WPUpdate);