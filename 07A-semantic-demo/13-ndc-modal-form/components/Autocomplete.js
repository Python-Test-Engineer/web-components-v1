import {
    SERVER,
    Utility,
    UI,
    BTN
} from '../global-autocomplete.js';


const template = document.createElement('template');
template.innerHTML = `
    <!-- path is where it will be once in index.html -->
    <link href="css/webcomponent-form.css" rel="stylesheet">
    
    <style>
   * {
        font-size: var(--main-font-size, 10px);
        color: var(--main-font-color, purple);
    }
    .search-output {
        color:orange;
        font-style: italic;
        font-size: var(--main-font-size, 16px)
    }
    #output, #formMessage  {
        border: 2px solid black;
        border-radius: 10px;
        padding:20px;
        margin-bottom:20px;
        min-height:200px;
        background: #fff;
        color: var(--main-font-color, purple);
        word-break:break-all;
          
    }
    #formMessage {
        min-height:40px;
        padding:2px 0 0 10px;
    }
    #endpoint {
        word-break:break-all;
        font-size: var(--main-font-size, 10px);
        color: var(--main-font-color, purple);
    }
    </style>
    <div class="container">
        <h1>Find user component</h1>
        <div id="endpoint"></div>
      
        <p><span class="req">*</span> denotes required</p>
        <!-- ********************************************  FORM ***********************************  -->
       
        <form id="myForm">
            <div>  
                <label>Title</label><span class="req">*</span> <span id="titleError"></span><br>
                <input id="title" class="input-initial" type="text" name="title" placeholder="Enter new title here..." >
            </div>
            <div>  
           <input id="btnSubmit" name="btnSubmit" type="button" ><br><br>
                <div id="formMessage" class="card"></div>
            </div>    
        </form>
        <h3>OUTPUT => </h3>
        <br>
        <div id="output"></div>
    </div><!-- end container -->
    `;
class WPAutocomplete extends HTMLElement {
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
        this.searchMessage;

        // output
        this.output = this.shadowRoot.getElementById('output');
        this.endpoint = this.shadowRoot.getElementById('endpoint');

        this.endpoint.innerHTML = `Endpoint: ${this.getAttribute('url')}`;

        // title
        this.titleField = this.shadowRoot.getElementById('title');
        this.titleError = this.shadowRoot.getElementById('titleError');
        this.titleValid = false;
        this.titleHandlerListener;
        this.titleRegEx = /^([\sa-zA-Z0-9@\-\_\.]+)$/; // regex for the field
        this.titleMinLength = 6;
        this.titleField.focus();

    }

    connectedCallback() {
        // create a named event listener to remove in disconnectedCallback
        this.titleHandlerListener = (e) => {
            this.titleHandler(); // arrow fn avoids need for self = this
        }
        this.titleField.addEventListener("keyup", this.titleHandlerListener)
    };
    formatButton(val) {
        if (this.formIsValid()) {
            this.formMessage.innerHTML = val;
            BTN.setBtnValid(this.btn);

        } else {
            this.formMessage.innerHTML = val;
            BTN.setBtnInvalid(this.btn);

        }
    }
    doSearch() {
        this.output.innerHTML = `Endpoint<br>
            ${this.getAttribute('url') +this.titleField.value}
        
        `;
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
        this.searchMessage = `search term is <span class="search-output">${this.titleField.value}</span>`;
        this.formatButton(this.searchMessage);
    }
    titleImmediateHandler(val) {

        if (this.titleRegEx.test(val)) {
            this.titleError.innerHTML = "<span class='success'> VALID</span>";
            this.titleValid = true;
            UI.formatSuccess(this.titleField);

        } else {
            this.titleError.innerHTML = "<span class='error'> INVALID</span>";
            this.titleValid = false;
            UI.formatError(this.titleField)
        }
        this.formatButton(this.searchMessage)
    }
    titleAfterDelayHandler() {
        if (this.titleField.value.length < this.titleMinLength) {
            this.titleError.innerHTML = `<span class='error'>${this.titleMinLength} or more characters</span>`;
            UI.formatError(this.titleField)
            this.titleValid = false;
            this.formatButton(this.searchMessage);

            return;
        }
        this.titleImmediateHandler(this.titleField.value);
        if (this.formIsValid) {
            this.doSearch(this.titleField.value);
        }
    }

    static get observedAttributes() {
        return ['url'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === "url") {
            console.log(`url:${newValue}`);
        }
    }

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

    clearFields() {
        BTN.setBtnInitial(this.btn);
        this.titleField.value = "";
        UI.formatNeutral(this.titleField);
        this.titleError.innerHTML = "";
    }
    formIsValid() {
        if (this.titleValid) {
            //console.log("valid")
            return true;
        } else {
            return false;
        }
    }

    disconnectedCallback() {
        this.btn.removeEventListener('click', this.btnClick);
        this.titleField.removeEventListener('click', this.titleHandlerListener);
        this.titleTimer = null;
    }

}
// DEFINE CUSTOM ELEMENT
customElements.define('wp-autocomplete', WPAutocomplete);