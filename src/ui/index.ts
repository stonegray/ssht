// ui 

import ansiEscapes from 'ansi-escapes';
import { EventEmitter } from 'events';

function frame() {


	let buf = '';

	buf += 'foo';

	process.stdout.write(buf);
}

const uiEvents = new EventEmitter(); 

uiEvents.on('update', (object)=>{ 


});

frame();








