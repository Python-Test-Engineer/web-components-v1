customElements.define(
	'my-navbar',
	class extends HTMLElement {
		constructor() {
			super(); // always call super() first in the constructor.

			// Attach a shadow root to <fancy-tabs>.
			const shadowRoot = this.attachShadow({
				mode: 'open',
			});
			shadowRoot.innerHTML = `
            <style>
            body {
              margin: 0;
              font-family: var(--main-font, sans-serif);
              font-size: var(--main-font-size, 22px);
            }
            
            .topnav {
              overflow: hidden;
              background-color: #2196f3;
              max-width:1200px;
              margin: 0 auto;
            }
            
            .topnav a {
              float: left;
              display: block;
              color: #fff;
              text-align: center;
              padding: 14px 16px;
              text-decoration: none;
              font-family: var(--main-font, sans-serif);
              font-size: var(--main-font-size, 22px);
              font-weight:bold;
            }
            
            .topnav a:hover {
              background-color: orange;
              color: #fff;
            }
            
            .topnav a.active {
              background-color: orange;
              color: white;
            }
            
            .topnav .icon {
              display: none;
            }
            
            @media screen and (max-width: 600px) {
              .topnav a:not(:first-child) {display: none;}
              .topnav a.icon {
                float: right;
                display: block;
                z-index:100;
              }
            }
            
            @media screen and (max-width: 600px) {
              .topnav.responsive {position: relative;}
              .topnav.responsive .icon {
                position: absolute;
                right: 0;
                top: 0;
                z-index:100;
              }
              .topnav.responsive a {
                float: none;
                display: block;
                text-align: left;
              }
              .topnav a.active {
                background-color: #2196f3;
                color: white;
              }
            }
        </style>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <div class="topnav" id="myTopnav">
          
            <a href="index.html" class="active">&nbsp;&nbsp;WP-HTML&nbsp;&nbsp;</a>
         
            <a href="index.html">HOME</a>
            <a href="cat.html">CAT</a>
            <a href="dynamic.html">DYNAMIC</a>
            <a href="blog.html">BLOG</a>
            <a href="login.html">LOGIN</a>
            <a href="lazy.html">LAZY</a>
            <a href="read.html">OFFLINE</a>
          

            <a href="javascript:void(0);" id="btn" style="font-size:24px;" class="icon" >&#9776;</a>
        </div>
        <br>
 
        `;
		}
		connectedCallback() {
			const btn = this.shadowRoot.getElementById('btn');
			var x = this.shadowRoot.getElementById('myTopnav');
			// initially menu closed
			x.className = 'topnav';
			btn.addEventListener('click', function (event) {
				//alert('click');
				if (x.className === 'topnav') {
					x.className += ' responsive';
				} else {
					x.className = 'topnav';
				}
			});
		}
	},
);
