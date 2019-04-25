// New discovery plugin definition

require('source-map-support').install();

/* gcpConfig
 *
 * Make ssht aware of running GCP Compute instances by using the system's gcloud
 * utility.
 *
 * This requires that gcloud is configured, and a default project is set.
 *
 */

/*
 * Should export an EventEmitter. Makes the most sense, right?
 * - Async loading (eg. plugin.on('load', ...)
 * - Async return; we can return incremental updates to the list. 
 * - 
 *
 * Input: {
 *	dump: boolean; // output a debug dump file
 * }
 *
 * Output: {
 *	
 *
 */

import { 
	DSHost, 
} from '../shared/interfaces';

import {
	PluginArgs,
	DSPEvents,// debug, status, percentage, error, host
	DSPlugin // Constructor for a plugin
} from '../dsPlugin';

// argument: args?: PluginArgs
// emits: debugmsg
// emits: status
// emits: percentage
// emits: error
// emits: host
// listens: stop
// listens: start
// returns: instance of self


declare interface fooPlugin {
	// Enforce type within enum:
	//
	// Basically this is a hack to help restrict how events are called. You call
	// emit/on using DSPEvents.xyz instead of a string. (Which will fail to
	// compile with a DSPlugin
    on(event: DSPEvents, listener: Function): this;
	emit(event: DSPEvents, listener: any): boolean;
}

class fooPlugin extends DSPlugin {
	constructor(args?: PluginArgs){
		super();
		// Bind events:
		this.on(DSPEvents.start, this._start.bind(this));
	}

	_start(debug){
		setInterval(()=>{
			this.emit(DSPEvents.host, 'barf');
		},1000);
	}
}




const hosts = [];
const foo = new fooPlugin();

foo.emit(DSPEvents.start, 'bar');

foo.on(DSPEvents.host,h=>{
	hosts.push(h);
	console.log(hosts);
});


