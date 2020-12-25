import Screen from './screen.js';
import Input from './input.js';

import getTip from './tips.js';

import { EventEmitter } from 'events';

// emits: text
// recieves: results (arr of DSHosts)
export default class UserInterface extends EventEmitter {
	constructor(options){
		super();
		const self = this;

		this.options = {
			height: 8,
			...options
		}

		this.input = new Input({
			maxLength: 1e3
		})
	
		this.screen = new Screen({
			height: this.options.height
		});

		this.searchString = '';

		this.input.on('text', text =>{
			this.searchString = text.trim();
			self.frame();
			self.emit('text', text);
		});

		this.input.on('bell', reason => {
			// Write ascii bell

			const bell = new Uint8Array([0x07]);
			process.stdout.write(bell);
		})

		this._drawEmptyFrame();
	}

	_drawEmptyFrame(){
		this.screen.writeLine(0, 'SSHT>  Begin typing to search.');

		this.screen.writeLine(1, '1. ');
		this.screen.writeLine(3, '3.        Tip:'); 
		this.screen.writeLine(4, '4.        ' + getTip()); 
		this.screen.writeLine(2, '2. ');
		this.screen.writeLine(5, '5. ')
		this.screen.writeLine(6, '6. ');

		this.screen.writeLine(7, ' --- ready ---')
	}

	// Draw a frame on the screen:
	frame(){

		this.screen.writeLine(0, 
			'SSHT> ' + this.searchString);


	}
}
