/*
import UserInterface from './ui/tui.js';
import Pool from './pool.js';

const ui = new UserInterface();

const pool = new Pool();


ui.on('text', text => {
    pool.search(text);
});

pool.on('results', res => {
    ui.results(res);
});



process.stdin.on('keypress', function (k, kp) {
	if (kp && kp.ctrl && kp.name == 'c') process.exit();
});
*/

import Discover from './discovery/pluginLoader.js'



const frame = 32;
export default frame;