import readPkg from 'read-pkg';

import DiscoveryPlugin from '../../src/discovery/prototype.js';

export default class ConstructorErrorPlugin extends DiscoveryPlugin {
	constructor(){
		super();

		this.name = "Foo";
		this.description = "Example builtin plugin that does nothing.";

		throw new Error('Failed during constructor!');
	}
	start(){}
	stop(){}
	async meta() { return await readPkg(); }
}