// COMMON file for constants and helper functions
// For demo purposes, exporting two versions of thee site's base url.

export const SERVER = 'https://49plus.co.uk/';

export const testFn = function test(msg) {
	console.log(`%c${msg}`, 'color:green;font-size:18px');
};

export class Utility {
	static getUrl() {
		return 'https://wp-html.co.uk/';
	}
}
