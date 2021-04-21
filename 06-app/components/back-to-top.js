customElements.define(
	'back-to-top',
	class extends HTMLElement {
		constructor() {
			super(); // always call super() first in the constructor.

			// Attach a shadow root to <fancy-tabs>.
			const shadowRoot = this.attachShadow({
				mode: 'open',
			});
			shadowRoot.innerHTML = `
                <style> 
                    #myBtn {
                        font-family: var(--main-font, serif);
                        font-size: var(--main-font-size, 18px);
                        background-color: var(--primary, blue);
                        color: white;
                        display: none;
                        position: fixed;
                        bottom: 20px;
                        right: 75px;
                        z-index: 99;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        padding: 15px 10px;
                        border-radius: 50%;
                    }    
                    #myBtn:hover {
                        background-color: var(--hover, orange)
                    }
                </style>
                <button  id="myBtn" title="Go to top">Top</button>
            `;
		}
		connectedCallback() {
			const mybutton = this.shadowRoot.getElementById('myBtn');
			mybutton.addEventListener('click', this.topFunction);
			window.addEventListener('scroll', event => {
				const mybutton = this.shadowRoot.getElementById('myBtn');
				var scrollTop = window.pageYOffset;
				//console.log(scrollTop);
				if (scrollTop > 200) {
					mybutton.style.display = 'block';
					//console.log("SHOW", scrollTop);
				} else {
					mybutton.style.display = 'none';
				}
			});
		}

		// When the user clicks on the button, scroll to the top of the document
		topFunction() {
			//alert("SCROLL");
			var el = document.querySelector('body');
			var y = el.scrollHeight;
			//console.log(y);
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
	},
);
