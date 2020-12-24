import Screen from './screen.js';
import Input from './input.js';

import { EventEmitter } from 'events';



class UserInterface extends EventEmitter {
	constructor(options){
		super();

		this.options = {
			height: 8,
			...options
		}

		this.input = new Input({
			maxLength: 1e3
		})
	
		this.screen = new Screen({
			height: this.height
		});
	}

	// Draw a frame on the screen:
	frame(){

		this.screen

	}
}


input.on('text', console.log);

input.on('bell', reason => {
	// Write ascii bell
	
	const bell = new Uint8Array([0x07]);
	process.stdout.write(bell);
})

process.stdin.on('keypress', function (k, kp) {
	if (kp && kp.ctrl && kp.name == 'c') process.exit();
});


const frame = 32;
export default frame;