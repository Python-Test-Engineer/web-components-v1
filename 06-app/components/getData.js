// We can important site wide variables
// either through an IMPORT or a CLASS
import { SERVER, testFn } from '../util/global.js';

class ShowPost extends HTMLElement {
	constructor() {
		super();
		console.log('CONSTRUCTOR...');
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
              background: var(--background, #ccc);
              font-size: var(--main-font-size, 20px);
              font-family: var(--main-font, inherit);
              color: var(--main-font-color, black);
            }  
        </style>
        <!-- COMPONENT OUTPUT HERE -->
        <div id="info"></div>
    `;
	}
	static get observedAttributes() {
		return ['postid'];
	}
	attributeChangedCallback(attributeName, oldValue, newValue) {
		// this will fire initially as the element has no atrribute but is added when page runs
		console.log('attribute has changed');
		if (oldValue === newValue) {
			return;
		}
		if (attributeName === 'postid') {
			console.log(attributeName, oldValue, newValue);
			if (oldValue !== null) {
				testFn('in attributeChanged');
			}
			this.ID = newValue;
			this._getPosts(this.ID);
		}
	}
	connectedCallback() {
		// When component is added to DOM
		console.log('connectedCallback fired...');
	}
	disconnectedCallback() {
		// when component is removed from DOM
		console.log('Component removed - disconnectedCallback()...');
	}
	_getPosts(postID) {
		let url = SERVER + 'udemy/wp-json/wp/v2/posts/' + postID;
		console.log('URL: ', url);
		fetch(url)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				let output = '<br>';
				// reference the output INFO element in this components Shadow DOM
				const info = this.shadowRoot.querySelector('#info');
				info.innerHTML = '<h3>URL: ' + url + '</h3>';
				output += '<div class="card">';
				output += '<h1>PostID: <b>' + data.id + '</b></h1><br> Title: <b>' + data.title.rendered + '</b><br> Author: ';
				output += '<b>' + data.authorName.toUpperCase() + '</b><br>';
				output += '<p>' + data.content.rendered + '</p>';
				output += '</div>';
				info.innerHTML += output;
			});
	}
}
// We define custom component tag
customElements.define('show-post', ShowPost);
