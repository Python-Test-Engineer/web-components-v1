import {
  IDB
} from './idb.js'

// import './profile-card.js'

class WPIndexedDBRead extends HTMLElement {
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
      this.cat = newValue;
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
          let card = `<div><h2>${TABLE}</h2>`;
          console.log(post)
          for (var i = 0; i < post.length; i++) {
            console.log(post[i].id + " " + post[i].title + " " + post[i].authorName);
            card += '<div class="card">';
            card += 'PostID: <b>' + post[i].id + '</b><br> Title: <b>' + post[i].title;
            card += '</b><br> Author: ' + post[i].authorName;
            card += '<p>' + post[i].content + '</p>';
            card += '</div>';
          }
          card += "</div>";
          output.innerHTML = card;
        }
      })
  }
  disconnectedCallback() {}
}
customElements.define('wp-indexeddb-read', WPIndexedDBRead);