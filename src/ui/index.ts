// ui 


import chalk from 'chalk';
import { EventEmitter } from 'events';

import keyboard from './keyboard';

setTimeout(process.exit, 1029120);

const ui = new EventEmitter();


keyboard.on('search', search=>{
	console.log('Running search for', search);
	ui.emit('search', search);
});





export default ui;




