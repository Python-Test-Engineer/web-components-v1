class ShowWordCamps extends HTMLElement {
   constructor() {
      super();
      //this._arrayPosts = [];
      //this._id = '';
      this.url;
      this.attachShadow({
         mode: "open"
      });
      this.shadowRoot.innerHTML = `
          <style>
              .card {
                border: 2px solid black;
                border-radius: 10px;
                padding:20px;
                margin-bottom:20px;
                font-size: var(--main-font-size, 22px);
              }  
              button {
                 color: white;
                 background: #2196f3;
                 padding: 10px;
                 font-size:24px;
                 border-radius:5px;
                 margin: 0 20px;
                 cursor:pointer;
              }
             .app {
               border: 2px solid #2196f3;
               border-radius: 10px;
               padding:20px;
               margin-bottom:20px;
               font-size: var(--main-font-size, 22px);
              }
            @media only screen and (max-width: 767px) {             
                .card {
                    border: 2px solid red;
                    border-radius: 10px;
                    padding:20px;
                    margin-bottom:20px;
                    font-size: var(--mobile-font-size, 18px);
                    color: red;
                    word-break: break-all;
                }  
            }
          </style>
       
          <div id="info"></div>
      `;
   }
   connectedCallback() {

      const btn = this.shadowRoot.getElementById('info');
      btn.addEventListener('click', (e) => {
         console.log(e.target);
         const target = e.target.getAttribute('id');
         const event = e.target.getAttribute('event');
         console.log(event)
         this.show(target);
      })
   }
   static get observedAttributes() {
      return ['country'];
   }
   attributeChangedCallback(name, oldValue, newValue) {
      // this will fire initially as the element has no atrribute but is added when page runs
      // this runs before connectedCallback so this_getPosts is fired here not in 
      // connectedCallback

      if (oldValue === newValue) {
         console.log("NULL attribute has changed")
         console.log("attribute=" + name, "oldValue=" + oldValue, "newValue=" + newValue);
         return;
      }
      // if (name === "url") { //  && oldValue !== null will not set initial value from LIGHT DOM
      //    console.log("url attribute has changed")
      //    console.log("attribute=" + name, "oldValue=" + oldValue, "newValue=" + newValue);
      //    this.Url = newValue;
      //    this._getPosts(this.Url);
      // }
      if (name === "country") { //  && oldValue !== null will not set initial value from LIGHT DOM
         console.log("url attribute has changed")
         console.log("attribute=" + name, "oldValue=" + oldValue, "newValue=" + newValue);

         this.Url = ' https://api.wordpress.org/events/1.0/?location=' + newValue;
         this._getPosts(this.Url);
      }
   }
   disconnectedCallback() {}
   show(target) {
      console.log("TARGET = " + target);
      const id = +target.substr(4, 4) + 1;
      console.log("id = " + id);
      let action = target.substr(0, 4);
      const appDIV = `action${id -1}`;
      const app = this.shadowRoot.getElementById(appDIV);
      app.style.display = 'block';
      app.style.fontWeight = 'bold';
      app.style.fontSize = '32px';
      app.style.color = '#2196f3';

      let appMessage = null;
      switch (action) {
         case 'btnR':
            action = "REGISTER";
            appMessage = `You can book here for event <b>${id}</b>`;
            break;
         case 'btnF':
            action = "BOOK FLIGHT"
            appMessage = `List of flights...`;
            break;
         case 'btnH':
            action = "BOOK HOTEL"
            appMessage = `Recommended hotels...`;
            break;
         case 'btnG':
            action = "GET GUIDE"
            appMessage = `When in Kent, Ohio...`;
            break;
         default:
            // code block
      }
      //alert(`${action} event with ID: ${id}`);
      app.innerHTML = appMessage;




   }
   _getPosts(url) {
      fetch(url)
         .then(res => res.json())
         .then(data => {
            console.log(data);
            let i;
            let event = null;
            let output = "<br>";
            output += `<h2>SHOW ALL POSTS FOR A URL</h2><h2>${url}</h2>`;
            output += `<h2>Number of events: ${data.events.length}</h2>`;

            const info = this.shadowRoot.querySelector("#info");
            info.innerHTML = "";
            // console.log("Number of Events: " + data.events.length);
            for (i = 0; i < data.events.length; i++) {
               event = data.events[i].title;
               output += '<div class="card">';
               output += `<b>EVENT ID: ${i + 1}</b><br>`;
               output += "Type: <b>" + data.events[i].type + "</b><br>";
               output += "Title: <b>" + data.events[i].title + "</b><br>";
               output += "Group: " + data.events[i].meetup + "<br>";
               output += "<p>" + data.events[i].date + "</p>";
               output += `<button id=btnR${i} event=${event}>REGISTER</butto>`;
               output += `<button id=btnF${i}>BOOK FLIGHT</button>`;
               output += `<button id=btnH${i}>BOOK HOTEL</button>`;
               output += `<button id=btnG${i}>TRIP GUIDE</button>`;
               output += "</div>";
               output += `<div  class="app" id=action${i} style="display:none;"></div>`;
            }
            info.innerHTML += output;
         });
   }
   publicMethod(value) {
      alert("Using " + value + " as URL.");
      const webComponent = document.querySelector('show-all-posts-url');
      webComponent.setAttribute('url', value);
   }
}
customElements.define("show-wordcamps", ShowWordCamps);