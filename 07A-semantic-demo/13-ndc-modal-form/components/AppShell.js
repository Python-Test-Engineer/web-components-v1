// two web component files imported
import './ProfileCard.js';
import './Post.js';

// NO SHADOW DOM
class AppShell extends HTMLElement {
    constructor() {
        super();
        // does not work with shadow dom
        // this.attachShadow({
        //     mode: 'open'
        // });

    }
    connectedCallback() {

        this.innerHTML = `
            <style>
                #main {
                    display:flex; 
                    flex-wrap:wrap; 
                    justify-content:center;
                    background:#eee;
                    padding:10px;
                }
            </style>
            <div id="main"></div>
            `;
        fetch('https://randomuser.me/api/?results=2&nat=gb')
            .then(res => res.json())
            .then(data => {
                console.log(data.results);
                for (let i = 0; i < data.results.length; i++) {
                    document.getElementById('main').innerHTML += `
                        <profile-card
                            first-name="${data.results[i].name.first}" 
                            last-name="${data.results[i].name.last}" 
                            city="${data.results[i].location.city}"
                            picture="${data.results[i].picture.medium}"
                        >
                            <!-- this is slot in profile-card -->
                            <span>
                                 <show-post message="${data.results[i].email }" ></show-post>
                            </span>

                        </profile-card><br>       
                `;
                }

            });


    }

}
customElements.define('app-shell', AppShell);