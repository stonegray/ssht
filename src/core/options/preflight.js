
const definitions = [];

// Plugin options
definitions.push({
	name: 'noPreflight',
	default: false,
	type: 'number',
	alias: '-N',
	argument: '--no-preflight',
	fileId: 'main',
	fileField: 'noPreflight',
	allowEmpty: true,
	description: "Disable HostChecker (not recommended, may break other  features that rely on host information)",
	hidden: false,
	conflicts: [],
	group: 'Network',
	validator: () => {
		return true;
	}
});


export default definitions;