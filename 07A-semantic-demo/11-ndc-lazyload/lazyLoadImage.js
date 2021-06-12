class LazyLoad extends HTMLElement {
    constructor() {
        super();
        this.imgURL;
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `
        <style>
        .image {
            display: block;
            margin-top: 100px;
            margin-bottom: 100px;
            max-width: 800px;
            height: 600px;
            border: 1px solid black;
            z-index: 10;
        }
        </style>
    
        <img id="image1"  alt="lazy load image needs to cross threshold 350px from bottom with at least 20% of its height" class="image">
       
    `;
    }
    static get observedAttributes() {
        return ["pic"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        if (oldValue === newValue) {
            return;
        }
        if (name === "pic") {
            console.log(name, oldValue, newValue);
            this.imgURL = newValue;
        }

    }
    connectedCallback() {
        let options = {
            // root: null,
            // threshold: 1.0,
            // rootMargin: '0px'
            root: null,
            // 400px above the fold for demo purpses
            rootMargin: "0px 0px -400px 0px",
            threshold: 0.0
        }
        const lazyImage = this.shadowRoot.querySelector('#image1');
        let callback = (entries, observer) => {

            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.className === 'image') {
                    //let imageUrl = lazyImage.getAttribute('data-img');
                    let imageUrl = this.imgURL;
                    if (imageUrl) {
                        entry.target.src = imageUrl;
                        console.log("loading IMAGE..." + imageUrl);
                        observer.unobserve(entry.target);
                    }
                }
            });

        }
        let observer = new IntersectionObserver(callback, options);
        observer.observe(lazyImage);
    }

    disconnectedCallback() {

    }

}
customElements.define('wp-lazy-load', LazyLoad);