import readPkg from 'read-pkg';

import DiscoveryPlugin from '../../src/discovery/prototype.js';

export default class StartErrorPlugin extends DiscoveryPlugin {
	constructor(){
		super();

		this.name = "Foo";
		this.description = "Example builtin plugin that does nothing.";
	}
	start(){
		throw new Error('Failed during constructor!');
	}
	stop(){}
	async meta() { return await readPkg(); }
}