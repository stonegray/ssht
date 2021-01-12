
function controlSequence(args, fun) {

	let arg;

	arg = Array.isArray(args) ? args.join(';') : args;

	process.stdout.write('\u001B[' + arg + fun);
}

export const cursor = {

	clear: () => controlSequence(2, 'K'),

	// Relative movement:
	up: (lines) => controlSequence(lines, 'A'),
	down: (lines) => controlSequence(lines, 'B'),
	lineUp: (lines) => controlSequence(lines, 'F'),
	lineDown: (lines) => controlSequence(lines, 'E'),


	// Save/restore:
	save: () => controlSequence([], 's'),
	restore: () => controlSequence([], 'u'),

	// SGR:
	sgr: (args) => controlSequence(args, 'm'),


	// Cursor
	hide: () => controlSequence('?25', 'l'),
	show: () => controlSequence('?25', 'h'),

	// Colors:

	bold: bool => bool ? 
		controlSequence(1, 'm') :
		controlSequence()
    
};