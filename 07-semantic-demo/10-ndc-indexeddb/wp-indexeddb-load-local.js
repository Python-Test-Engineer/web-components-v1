import {
   SERVER
} from '../00-ndc-global/global.js';

import {
   IDB
} from './idb.js'
class WPIndexedDBLoadLocal extends HTMLElement {
   constructor() {
      super();
      this.Posts = '';
      this.DB_VERSION; // = 2;
      this.DB_NAME; // = 'CAT6';
      this.TABLE; // = 'wpCAT6';
      this.URL; // = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts?categories=' + 6;
      this.attachShadow({
         mode: 'open'
      });
   }
   connectedCallback() {
      //this.getData(this.DB_NAME, this.TABLE, this.DB_VERSION, this.URL);
   }
   static get observedAttributes() {
      return ["cat"];
   }
   attributeChangedCallback(name, oldValue, newValue) {
      // this will fire initially as the element has no atrribute but is added when page runs
      if (oldValue === newValue) {
         return;
      }
      if (name === 'cat') {
         console.log(name, oldValue, newValue);
         const DB_NAME = 'cat' + newValue;
         const TABLE = 'wpcat' + newValue;
         console.log("[SERVER] " + SERVER);
         const URL = '../_data/' + DB_NAME + '.json';
         console.log("[URL] " + URL);
         this.loadData(DB_NAME, TABLE, 2, URL);
      }
   }
   loadData(DB_NAME, TABLE, DB_VERSION, URL) {

      console.log(DB_NAME, DB_VERSION, TABLE, URL);

      fetch(URL)
         .then(res => res.json())
         .then(data => {
            console.log("--------------" + data.length);
            console.log(data);
            console.log("Number of posts: " + data.length);
            IDB.db(DB_NAME, DB_VERSION, TABLE).then(function (DB_NAME) {
               const tx = DB_NAME.transaction(TABLE, 'readwrite');
               const dbTable = tx.objectStore(TABLE);
               for (let i = 0; i < data.length; i++) {
                  dbTable.put({
                     id: data[i].id,
                     title: data[i].title.rendered,
                     content: data[i].content.rendered,
                     authorName: data[i].authorName
                  });
               }
               return tx.complete;
            });
         });
   }
   disconnectedCallback() {}
}
customElements.define("wp-indexeddb-load-local", WPIndexedDBLoadLocal);