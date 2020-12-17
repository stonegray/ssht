import { EventEmitter } from 'events';
import * as readline from 'readline';


process.stdin.setRawMode(true);
readline.emitKeypressEvents(process.stdin);

process.stdin.setEncoding('utf8');


const searchBuffer= [];

const e = new EventEmitter();

process.stdin.on('keypress', function (k, kp) {

	// Delete character from buffer on backspace
	if (kp.name === 'backspace') {
		searchBuffer.pop();

		e.emit('search', searchBuffer.join(''));
	} else {

		// Push onto the string buffer:
		if (kp.ctrl === false && kp.meta === false) searchBuffer.push(kp.sequence);

		// Report an updated search string
		e.emit('search', searchBuffer.join(''));
	
	}


	console.log('keypress', kp);
	console.log('buffer', searchBuffer);
	
	if (kp && kp.ctrl && kp.name == 'c') process.exit();
});

const keyboard = e;
export default keyboard;




