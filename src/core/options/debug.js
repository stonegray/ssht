
const definitions = [];

// Plugin options
definitions.push({
	name: 'startupTimings',
	default: false,
	type: 'number',
	argument: '--dTiming',
	fileId: 'main',
	fileField: 'startupTimings',
	allowEmpty: false,
	description: "Internal: Print timing information to console on startup",
	hidden: true,
	conflicts: [],
	group: 'Debug:',
	validator: () => true
});

definitions.push({
	name: 'diags',
	default: false,
	type: 'boolean',
	argument: '--diags',
	fileId: 'main',
	fileField: 'diagnostics',
	allowEmpty: false,
	description: "Show diagnostics and exit",
	hidden: false,
	conflicts: [],
	group: 'Debug:',
	validator: () => true
});

export default definitions;