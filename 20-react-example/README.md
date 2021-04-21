We load in the JS Vanilla NPM in index.html and can then use the component in index.html or in App.js etc.

index.html

```
<!-- VANILL JS TO NPM -->
      <script type="module" src="https://unpkg.com/test-webcomponent-js@1.0.0/index.js"></script>
      <script nomodule src="https://unpkg.com/test-webcomponent-js@1.0.0/index.js"></script>
   </head>

   <body style="background:#ccc">
      <noscript>
         You need to enable JavaScript to run this app.
      </noscript>
      <!-- We can use here or in app itself. -->
      <div style="max-width:1000px; margin:0 auto;">
         <h1>In index.html</h1>

         <!-- $COMPONENT -->
         <show-post postid="1220"></show-post>
         <!-- $COMPONENT -->

      </div>
```
