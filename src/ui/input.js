
import { EventEmitter } from 'events';
import * as readline from 'readline';

import log from '../core/logger.js';

const mode = {
	'NORMAL': 0,
	'INSERT': 1,
	'VISUAL': 2
};

// Minimal single-line terminal text input field:
export default class Input extends EventEmitter {
	constructor(options){
		super();
		
		this.options = {
			modal: false,
			maxLength: 1e3,
			...options,
		};

		this.string = [];
		this.selection = [0,0];
		this.cursor = 0;
		this.mode = mode.INSERT;
	
		try {
			process.stdin.setRawMode(true);
		} catch (e){
			log({
				level: 'warn',
				zone: 'ui',
				message: 'Failed to setRawMode on stdin'
			});	
		}
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setEncoding('utf-8');

		process.stdin.on('keypress', this.keypress.bind(this));
	}

	update(){
		//console.log(this.string.join('') + '\n',  this.selection, this.cursor);
		this.emit('text', this.string.join(''));
	}


	insert(char){
		
		// Limit length:
		if (this.string.length + 1 > this.options.maxLength){
			this.emit('bell', 'String exceeds maxLength');
			return;
		}

		// Write character:
		this.string.splice(this.cursor, 0, char);

		// Increment cursor:
		this.cursor++;
		
		this.update();

	}

	delete(forwards){

		if (forwards){

			// enforce bound and cancel deletion at end of string:
			if (this.cursor <= 0) {
				this.emit('bell', 'Can\'t backspace character at beginning of string');
				return this.cursor = 0;
			}

			this.string.splice(this.cursor - 1, 1);

			// enforce bound:
			this.cursor--;
			if (this.cursor < 0) this.cursor = 0;

			this.update();
			
		} else {

			// Delete if we can, otherwise bell:
			if (this.cursor != this.string.length){
				this.string.splice(this.cursor, 1);
				this.update();
			} else {
				this.emit('bell', 'Can\'t delete character at end of string.');
			}
		}
	}

	keypress(k, kp){

		// Experimental modality:
		/*
		if (this.mode == mode.NORMAL){
			if (k == 'v'){
				this.mode = mode.VISUAL;
			}
			if (k == 'i'){
				this.mode = mode.INSERT;
			}
		} else {
			if (kp.name == 'escape'){
				this.mode = mode.NORMAL;
			}
		}*/

		// Handle keys used for editing:
		if (kp.name === 'backspace'){
			this.delete(true);
			return;
		}
		if (kp.name === 'delete'){
			this.delete(false);
			return;
		}


		// Handle movement keys:
		if (kp.name == 'left'){
			this.cursor--;
			if (this.cursor <= 0) this.cursor = 0;
			return;
		}
		if (kp.name == 'right'){
			this.cursor++;

			// Limit cursor position:
			if (this.cursor > this.string.length){
				this.cursor = this.string.length;
			}
			return;
		}
		if (kp.name == 'home'){
			return this.cursor = 0;
		}
		if (kp.name == 'end'){
			return this.cursor = this.string.length;
		}


		// Filter out special stuff:
		if (kp.ctrl || kp.meta || kp.code || ['tab','return'].includes(kp.name)){
			return;
		}

		// Anything else can be assumed to be a key:
		if (this.mode == mode.INSERT){
			this.insert(k);
		}

	}
}

