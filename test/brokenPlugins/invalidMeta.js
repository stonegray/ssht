import DiscoveryPlugin from '../../src/discovery/prototype.js';

export default class InvalidMetaPlugin extends DiscoveryPlugin {
	constructor(){
		super();

		this.name = "Foo";
		this.description = "Example builtin plugin that does nothing.";

		throw new Error('Failed during constructor!');
	}
	start(){}
	stop(){}
	async meta() {
		return {
			foo: 0
		};
	}
}