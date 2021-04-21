class LazyLoadComponent extends HTMLElement {
    constructor() {
        super();
        this.imgURL; // set up some initial class level state - could be default values
        this.ID; // set up some initial class level state - could be default values
        this.attachShadow({
            mode: 'open'
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
                overflow-x: hidden;
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
        return ["postid"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        console.log("attribute has changed")
        if (oldValue === newValue) {
            return;
        }
        if (name === "postid") {
            console.log(name, oldValue, newValue);
            this.ID = newValue;
        }
    }
    connectedCallback() {

        const lazyComponent = this.shadowRoot.querySelector('#component');

        let callback = (entries, observer) => { // Intersection Observer API
            entries.forEach(entry => {
                if (entry.isIntersecting) { // Intersection Observer API
                    // START Usual fetch and display
                    console.log("loading...");
                    let apiUrl = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts/' + this.ID;
                    console.log("Making AJAX to: " + apiUrl);
                    fetch(apiUrl)
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let output = '<br>';
                            const info = this.shadowRoot.querySelector('#info');
                            info.innerHTML = '';
                            console.log("Loading Lazy Post");
                            output += '<div class="card">';
                            output += 'PostID: <b>' + data.id + '</b><br> Title: <b>' + data.title.rendered + '</b> by Author ';
                            output += '<b>' + data.authorName.toUpperCase() + '</b><br>';
                            output += '<p>' + data.content.rendered + '</p>';
                            output += '</div>';
                            info.innerHTML += output;
                        });
                    // END Usual fetch and display
                    observer.unobserve(entry.target); // Intersection Observer API
                }
            });
        }
        let options = {
            // root: null,
            // threshold: 1.0,
            // rootMargin: '0px'
            root: null,
            rootMargin: "0px 0px -400px 0px", // 400px above the fold for demo purpses
            threshold: 0.0 // what percentage of object must be in view to activate it.
        }
        // Create instance of Intersection Observer with options
        let observer = new IntersectionObserver(callback, options);
        observer.observe(lazyComponent); // Initiate observer
    }
    disconnectedCallback() {}
}
customElements.define('wp-lazy-load-component', LazyLoadComponent);