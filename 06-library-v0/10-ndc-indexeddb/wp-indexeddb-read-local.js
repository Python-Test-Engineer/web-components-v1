import {
   IDB
} from './idb.js'

import './profile-card.js'

class WPIndexedDBReadLocal extends HTMLElement {
   constructor() {
      super();
      // this.Posts;
      this.DB_VERSION; //= 2;
      this.DB_NAME; // = 'CAT6';
      this.TABLE; // = 'wpCAT6';
      this.attachShadow({
         mode: 'open'
      });
      this.shadowRoot.innerHTML = `
        <style>
            body { 
              font-family: sans-serif;
            }
            #info {
                display:none;
                padding:20px;
                background:#ccc;
                width:700px;
                margin:20px auto;
                border: 4px solid #2196f3;
                border-radius:10px;
                font-size:20px;
            }
            #btn {
                background-color: #2196f3;
                color: #fff;
                font-size:22px;
                width:100px;
            }
        </style>
        <div id="output"></div>
    `;
   }
   static get observedAttributes() {
      return ['cat'];
   }
   attributeChangedCallback(name, oldValue, newValue) {
      // this will fire initially as the element has no atrribute but is added when page runs
      if (oldValue === newValue) {
         return;
      }
      // if we use && oldValue !== null then we would need to call readData() in connectedCallback
      if (name === 'cat') {
         console.log(name, oldValue, newValue);
         const DB_NAME = 'cat' + newValue;
         var TABLE = 'wpcat' + newValue;
         this.readData(DB_NAME, TABLE, 2);
      }
   }
   connectedCallback() {
      // if we are not responding to change in attribute from 'null' to a value then we
      // would need to uncomment the line below...
      // this.readData(this.DB_NAME, this.TABLE, this.DB_VERSION);
   }
   readData(DB_NAME, TABLE, DB_VERSION) {
      console.log("readData", DB_NAME, TABLE, DB_VERSION);
      //const DB_NAME = db;
      //const TABLE = table;
      //const DB_VERSION = version;
      const output = this.shadowRoot.querySelector('#output');
      IDB.db(DB_NAME, DB_VERSION, TABLE)
         .then(function (DB_NAME) {
            let post;
            const tx = DB_NAME.transaction(TABLE, 'readonly');
            const dbTable = tx.objectStore(TABLE);
            const request = dbTable.getAll();
            request.onsuccess = function (event) {
               post = event.target.result;
               let card = ``;
               console.log(post)
               for (var i = 0; i < post.length; i++) {
                  //console.log(post[i].id + " " + post[i].title + " " + post[i].authorName); 
                  card += `
                     <p>
                        <profile-card
                        postid= "${post[i].id}" 
                        posttitle="${post[i].title}" 
                        author="${post[i].authorName}" 
                        content="${post[i].content}" 
                        >
                        </profile-card>
                     </p>
                   `;
               }
               card += "</div>";
               output.innerHTML = card;
            }
         })
   }
   disconnectedCallback() {}
}
customElements.define('wp-indexeddb-read-local', WPIndexedDBReadLocal);