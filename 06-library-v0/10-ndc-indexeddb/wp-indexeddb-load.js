import {
	SERVER
} from '../00-ndc-global/global.js';

import {
	IDB
} from './idb.js'
class WPIndexedDBLoad extends HTMLElement {
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
			var db = 'cat' + newValue;
			var table = 'wpcat' + newValue;
			console.log("[SERVER] " + SERVER);
			let url = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts?categories=' + newValue;
			console.log("[INDEXEDDB URL] " + url);
			this.loadData(db, table, 2, url);
		}
	}
	loadData(db, table, version, url) {
		let DB_NAME = db;
		let TABLE = table;
		let DB_VERSION = version;
		let URL = url;
		console.log(DB_NAME, DB_VERSION, TABLE, URL);
		// there a number of libraries for IndexedDB which can be refactored into the component
		// the function createDatabase can be refactored into the global file.

		//const apiUrl = "https://wpjs.co.uk/wpb/wp-json/wp/v2/posts?categories=6";
		// let apiUrl = 'listAPI.json';
		fetch(URL)
			.then(res => res.json())
			.then(data => {
				console.log("--------------" + data.length);
				console.log(data);
				console.log("Number of posts: " + data.length);
				IDB.db(DB_NAME, DB_VERSION, TABLE).then(function (db) {
					const tx = db.transaction(TABLE, 'readwrite');
					const dbTable = tx.objectStore(TABLE);
					for (var i = 0; i < data.length; i++) {
						dbTable.put({
							id: data[i].id,
							title: data[i].title.rendered, //double quotes on field optional
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
customElements.define("wp-indexeddb-load", WPIndexedDBLoad);