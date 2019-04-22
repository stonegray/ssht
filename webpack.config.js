const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// if we have swnp, use it.
let swnp = a => a;

module.exports = swnp({
	'target': 'node',
	'mode':   'production',
	'entry':  {
		'app': ['./server.js']
	},
	'resolve': {
		'modules': ['node_modules']
	},
	'output': {
		'path':     path.resolve(__dirname, './build'),
		'filename': 'min.js'
	}
});
