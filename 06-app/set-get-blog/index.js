import './post-list.js';
import './post-detail.js';
const postListComponent = document.querySelector('all-posts');
const postDetailComponent = document.querySelector('the-post');
//let url = '../_data/cat25.json';
let url = 'https://wpjs.co.uk/wpb/wp-json/wp/v2/posts/';

console.log('[URL] ' + url);
// selectedPost is the name of a Custom Event defined in post-list.js
// when button clicked the event is fired and data passed to index.js
// this then uses SETTER to load post detail component
postListComponent.addEventListener('selectedPost', e => {
  // links to post-detail.js
  postDetailComponent.aPost = e.detail;
});
fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('FETCH', data);
    // load the postListComponent with array of posts
    // we can set a property on an HTML tag and this property can be an array
    // links to post-list.js and uses 'set' function
    postListComponent.allPosts = data;
    // set initial post to be displayed
    // if value of array is invalid there will be no display
    // Comment out line below to not show a post initially
    // links to post-detail.js and uses set funtion
    postDetailComponent.aPost = data[0];
    //alert(data[2].id + ' ' + data[2].slug) ;
  });
