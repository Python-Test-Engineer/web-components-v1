// two web component files imported
import './profile-card.js';
import './show-post.js';

// NO SHADOW DOM
class RandomUsers extends HTMLElement {
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
                }
            </style>
            <div id="main"></div>
            `;
        const url = 'https://randomuser.me/api/?results=22&nat=gb';
        fetch(url)
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
customElements.define('random-users', RandomUsers);