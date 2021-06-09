### This takes a Vanilla Web Component and publishes it to NPM.

### In NPM as test-webcomponent-js

```
<script type="module" src="https://unpkg.com/test-webcomponent-js@1.0.1/index.js"></script>
<script nomodule src="https://unpkg.com/test-webcomponent-js@1.0.1/index.js"></script>

  <!-- $COMPONENT -->
  <show-post postid="1220"></show-post>
  <!-- $COMPONENT -->

```

1. the NAME in package.json mut be unique across npm
2. make changes to js
3. update package.json version etc...
4. login to npm
5. npm publish (be in correct folder!)
6. change version number in html page
