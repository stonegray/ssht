import UserInterface from './ui/tui.js';

const ui = new UserInterface();



process.stdin.on('keypress', function (k, kp) {
	if (kp && kp.ctrl && kp.name == 'c') process.exit();
});


const frame = 32;
export default frame;