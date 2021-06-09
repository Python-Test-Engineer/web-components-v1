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
              border: 4px solid #ccc;
              border-radius: 10px;
              padding:20px;
              margin-bottom:20px;
              background: var(--background, #ccc);
              font-size: var(--main-font-size, 20px);
              font-family: var(--main-font, inherit);
              color: var(--main-font-color, black);
            }  
						.edit {
							font-size:24px;
							color:red;
						}
        </style>
				<div class="edit">An edit on 09JUN2021 to 1.0.3</div>
        <!-- COMPONENT OUTPUT HERE -->
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
		console.log('connectedCallback fired...');
	}
	disconnectedCallback() {
		// when component is removed from DOM
		console.log('Component removed - disconnectedCallback()...');
	}
	_getPosts(postID) {
		console.log(postID);

		let url = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts/' + postID;
		console.log(url);
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				let output = '<br>';
				// reference the output INFO element in this components Shadow DOM
				const info = this.shadowRoot.querySelector('#info');
				info.innerHTML = '<h3>URL: ' + url + '</h3>';
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
