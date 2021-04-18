// This provides a fast, dependency-free loading indicator. 

/* It's probable that most users won't see this unless something is taking an
unusual amount of time. But the UX of staring at a black screen when you're 
trying to work is terrible, so I think this is worthwhile */

import { cursor } from './terminalUtils.js';

// the classic:
const animation = ['-','/','|','\\'];

const framerate = 15;

let frame = 0;
let message = "loading core libraries...";

function drawFrame(){
	cursor.clear();
	const a = animation[frame++ % animation.length];
	const str = `\r[ ${a} ] ${message} (D:${frame})`;
	process.stdout.write(str);
}

const interval = setInterval(drawFrame, 1e3/framerate);

export default function loadingMessage(m){
	message = m;
}

export function doneLoading(){
	process.stdout.write('\r');
	cursor.clear();
	clearInterval(interval);
}