import { SERVER, Utility } from '../00-ndc-global/global.js';

class LazyLoadComponent extends HTMLElement {
	constructor() {
		super();
		this.imgURL;
		this.ID;
		this.attachShadow({
			mode: 'open',
		});
		this.shadowRoot.innerHTML = `
        <style>
        .web-component {
            display: block;
            max-width: 800px;
            height: 700px;
            padding:20x;
            border: 1px solid black;
            background:#ccc;
           
            overflow-y: hidden;
            overflow-x:hidden;
        }
        #info {
            padding:20px;
        }
        </style>
        
    
        <div id="component" class="web-component">
             <div id="info" ></div>
        </div>
      
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
		}
	}
	connectedCallback() {
		let options = {
			// root: null,
			// threshold: 1.0,
			// rootMargin: '0px'
			root: null,
			// 400px above the fold for demo purpses
			rootMargin: '0px 0px -400px 0px',
			threshold: 0.0,
		};
		const lazyComponent = this.shadowRoot.querySelector('#component');
		let callback = (entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					let url = `${SERVER}wpb/wp-json/wp/v2/posts/` + this.ID;
					console.log(`%cURL: ${url}`, 'color:green;font-size:18px');
					fetch(url)
						.then((res) => res.json())
						.then((data) => {
							console.log(data);

							let i;
							let output = '<br>';
							const info = this.shadowRoot.querySelector('#info');
							info.innerHTML = '';
							console.log('Loading Lazy Post');
							output += '<div class="card">';
							output +=
								'PostID: <b>' + data.id + '</b><br> Title: <b>' + data.title.rendered + '</b> by Author ';
							output += '<b>' + data.authorName.toUpperCase() + '</b><br>';
							output += '<p>' + data.content.rendered + '</p>';
							output += '</div>';

							info.innerHTML += output;
						});

					observer.unobserve(entry.target);
				}
			});
		};
		let observer = new IntersectionObserver(callback, options);
		observer.observe(lazyComponent);
	}

	disconnectedCallback() {}
}
customElements.define('wp-lazy-load-component', LazyLoadComponent);
