// We can important site wide variables
// either through an IMPORT or a CLASS
import {
    SERVER,
    Utility
} from './global.js';

import './update.js';

console.log("[SERVER from import] " + SERVER);

class ShowPost extends HTMLElement {
    constructor() {
        super();
        //console.log("CONSTRUCTOR...")
        this.ID;
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `
            <link href="../_css/webcomponent-form.css" rel="stylesheet">
            <style>
                .card {
                border: 2px solid black;
                border-radius: 10px;
                padding:20px;
                margin-bottom:20px;
                background: var(--background-color-01, yellow);
                font-size: var(--main-font-size, 20px);
                font-family: var(--main-font, inherit);
                color: var(--main-text-color, red);
                }  
                #update {
                    display:none;
                    margin-top:10px;
                }
            
                
            </style>
            <!-- COMPONENT OUTPUT HERE -->
            <div class="card">
                <div id="info"></div>
                <div>
                    <button id="btnCancel" style="display:none;">CANCEL</button>  &nbsp;
                    <button id="btnUpdate" >EDIT</button>
                </div>
                <div id="update">
                    <wp-update></wp-update>
                </div>
            </div>    
    `;
        this.updateEl = this.shadowRoot.querySelector('#update');
        this.editEl = this.shadowRoot.querySelector('#btnCancel');
    }
    static get observedAttributes() {
        return ["postid"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        //console.log("attribute has changed")
        if (oldValue === newValue) {
            console.log("Refreshing post...");
            if (oldValue !== null) {
                this._getPosts(this.ID);
            }

        }
        if (name === "postid" && oldValue !== null) {
            //console.log(name, oldValue, newValue);
            this.ID = newValue;
            if (this.ID !== null) {
                this._getPosts(this.ID)
            }

        }
    }
    connectedCallback() {
        const self = this;
        // When component is added to DOM
        // console.log("connectedCallback fired...");
        const btn = this.shadowRoot.querySelector('#btnUpdate');
        btn.addEventListener('click', function () {
            self._edit();
        })
        const btnCancel = this.shadowRoot.querySelector('#btnCancel');
        btnCancel.addEventListener('click', function () {
            self._cancel();
        })
    }
    disconnectedCallback() {
        // when component is removed from DOM
    }
    _getPosts(postID) {
        var utililityGetUrl = Utility.getUrl();

        let url = 'https://49plus.co.uk/social/api/controllers/post/get-post.php?id=' + postID;
        // console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                let output = '<br>';
                // get info element in shadow roor to display data
                const info = this.shadowRoot.querySelector('#info');
                info.innerHTML = '<h3 style="word-break:break-all;">URL: ' + url + '</h3>';
                output += 'PostID: <b>' + data[0].id + '</b><br> Title: <b>' + data[0].title + '</b><br> Author: ';
                output += '<p>' + data[0].body + '</p>';
                output += '</div>';
                info.innerHTML += output;

                //access child component
                const webComponent = this.shadowRoot.querySelector('wp-update');
                // use child component function to set edit field with current title
                webComponent.setField(data[0].title);
            })
            .finally(function () {

            })

    }
    _edit() {
        //console.log("EDIT")
        this.updateEl.style.display = 'block';
        this.editEl.style.display = 'inline-block';

    }
    _cancel() {
        //console.log("CANCEL")    
        this.updateEl.style.display = 'none';
        this.editEl.style.display = 'none';
        this.shadowRoot.querySelector('wp-update').clearFormMessage();

    }
}
customElements.define('show-post', ShowPost);