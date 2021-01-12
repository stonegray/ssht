/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

describe('Foo Tests', async ()=>{

	let module;

	// Instantiate module:
	it('Can instantiate module', async ()=>{
		// equal to: import {default as defaultModule} from '../src/main.js';
		const module = await import('../src/main.js').default;
	});

	// Check output is correct:
	it('works', async ()=>{
		return true;
	});
    
});