// We can export variables to be imported by another JS file
// ES6 back tick for template literals
export const CSS = ` 
   .import {
      border-radius: 10px;
      border: 3px solid var(--primary-color, red);
      padding:20px;
      margin-bottom:20px;
      background: var(--background, yellow);
      font-size: var(--primary-size, 20px);
      color: var(--primary-color, red);
   }  
`;
