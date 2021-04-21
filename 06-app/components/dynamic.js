import { SERVER } from '../util/global.js';

class ShowPost extends HTMLElement {
	constructor() {
		super();
		this.ID;
		this.attachShadow({
			mode: 'open',
		});
		this.shadowRoot.innerHTML = `
        <style>
            .card {
              border: 2px solid black;
              border-radius: 10px;
              padding:20px;
              margin-bottom:20px;
              background: var(--background,white);
              font-size: var(--main-font-size, 20px);
              font-family: var(--main-font);
              color: var(--main-text-color, red);
            }  
        </style>
        <div id="info"></div>
    `;
	}
	static get observedAttributes() {
		return ['postid'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		// this will fire initially as the element has no atrribute but is added when page runs
		console.log('attribute has changed');
		if (oldValue === newValue) {
			return;
		}
		if (name === 'postid') {
			console.log(name, oldValue, newValue);
			this.ID = newValue;
			this._getPosts(this.ID);
		}
	}

	connectedCallback() {
		// When component is added to DOM
		console.log('connectedCallback...');
	}

	disconnectedCallback() {
		// when component is removed from DOM
		console.log('disconnectedCallback...');
	}
	_getPosts(postID) {
		console.log(postID);
		console.log('[SERVER] ' + SERVER);
		let url = SERVER + 'udemy/wp-json/wp/v2/posts/' + postID;
		fetch(url)
			.then(res => res.json())
			.then(data => {
				console.log(data);

				let i;
				let output = '<br>';
				const info = this.shadowRoot.querySelector('#info');
				info.innerHTML = '<h3>URL: ' + url + '</h3>';
				console.log('Loading Lazy Post');
				output += '<div class="card">';
				output += 'PostID: <b>' + data.id + '</b><br> Title: <b>' + data.title.rendered + '</b><br> Author: ';
				output += '<b>' + data.authorName.toUpperCase() + '</b><br>';
				output += '<p>' + data.content.rendered + '</p>';
				output += '</div>';

				info.innerHTML += output;
			});
	}
}

customElements.define('show-post', ShowPost);
