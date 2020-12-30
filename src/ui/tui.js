import Screen from './screen.js';
import Input from './input.js';

import { theme } from './theme.js';

import log from '../core/logger.js';

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
			this.uiFields.search = text.trim();
			this.drawSearchLine();
			self.emit('text', text);
		});

		this.input.on('bell', reason => {
			// Write ascii bell

			const bell = new Uint8Array([0x07]);
			process.stdout.write(bell);
		})

		//
		this.uiFields = {
			inputMode: 'INSERT',
			poolSize: 0,
			resultSize: 0,
			search: '',
			visualBell: false,
		}

		this._drawEmptyFrame();

		log({
			zone: 'timing',
			message: "Drew first frame",
			data: process.uptime()
		})
	}

	_drawEmptyFrame(){

		const lines = theme.splash();

		lines.splice(0, this.screen.height);

		lines.forEach(line =>{

			this.screen.writeLine(lines.indexOf(line), line);
		})
	}

	updateUIField(field, data){

		// Error prone, fixme:
		this.uiFields[field] = data;

		this.drawStatusLine();
	}

	drawStatusLine(){

		let string = theme.statusLine(this.uiFields);

		this.screen.writeLine(7,string);
	}

	drawSearchLine(){
		let string = theme.searchLine(this.uiFields);

		this.screen.writeLine(0,string);

	}

	// Draw a frame on the screen:
	results(arr){

		for (let i = 0; i < arr.length; i++) {
			const element = arr[i];

			const str = theme.resultLine(i, element, this.uiFields);

			this.screen.writeLine(i + 1, str);
		}

		// Fill blank lines:
		if (arr.length < this.options.height - 2){
			for (let i = arr.length; i < this.options.height - 2; i++) {
				this.screen.writeLine(i + 1, `${i + 1}. ~`);
			}
		}


	}
}
