// COMMON file for constants and helper functions
// For demo purposes, exporting two versions of thee site's base url.

export const SERVER = 'https://49plus.co.uk/';

export class Utility {
   static getUrl() {
      return 'https://49plus.co.uk/';
   }
} // var url = Utility.getUrl() gives the return value. Does not need a Class instance
export class UI {
   // ======= HELPER FUNCTIONS =======
   static formatSuccess(el) {
      el.classList.remove('input-error');
      el.classList.add('input-success');
   }
   static formatError(el) {
      el.classList.remove('input-success');
      el.classList.add('input-error');
   }
   static formatNeutral(el) {
      el.classList.remove('input-success');
      el.classList.remove('input-error');
   }
}
export class BTN {
   static setBtnInvalid(el) {
      el.classList.remove('w3-green');
      el.classList.add('w3-blue');
      el.value = 'NOT VALID';
      el.style.backgroundColor = 'red';
      el.style.color = '#fff';
      el.disabled = true;
      el.style.cursor = 'not-allowed';
   }
   static setBtnValid(el) {
      el.classList.remove('w3-blue');
      el.classList.add('w3-green');
      el.value = 'LOGIN';
      el.style.backgroundColor = 'green';
      el.style.color = '#fff';
      el.disabled = false;
      el.style.cursor = 'pointer';
   }
   static setBtnInitial(el) {
      el.value = 'LOGIN';
      el.style.backgroundColor = '#2196f3';
      el.style.color = '#fff';
      el.style.width = '200px';
      el.disabled = true;
      el.style.cursor = 'not-allowed';
   }
}
