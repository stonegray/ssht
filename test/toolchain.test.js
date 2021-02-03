/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

describe('Toolchain', async ()=>{

	// Instantiate module:
	it('Can run top-level-await', async ()=>{
		// equal to: import {default as defaultModule} from '../src/main.js';
		await import('../test/files/topLevelAwait.js').default;
	});

});
