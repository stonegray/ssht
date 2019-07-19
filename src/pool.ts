// connection handler
//
//

// Import our plugins:

import { sshPlugin } from './discover/ssh';
//import { vboxPlugin } from './discover/vbox';
//import { gcpPlugin } from './discover/gcp';
//import { dockerPlugin } from './discover/docker';
//import { floodPlugin } from './discover/flood';
import { fooPlugin } from './discover/foo';

import { EventEmitter } from 'events';

import { DSHost } from './shared/interfaces';
import { DSPEvents,DSPlugin } from './dsPlugin';

// register plugins:
const discoveryPlugins = [];
discoveryPlugins.push(fooPlugin);
//discoveryPlugins.push(gcpPlugin);
//discoveryPlugins.push(vboxPlugin);
//discoveryPlugins.push(floodPlugin);
discoveryPlugins.push(sshPlugin);
//discoveryPlugins.push(dockerPlugin);



/* 
 *   Pool
 *
 *
 * Keep track of all the discovered hosts.
 * Allow consumer, discovery, and info plugins to attach.
 *
 */

// Cache of hosts; this is the authorititaive source for the actual contents of
// the database record. 
const db:Array<DSHost> = [];





function addNewHost(host:DSHost){
	//console.log('Detected new '+host.kind+' host:'+host.name);
	db.push(host);
	return true;
}


// Register discovery plugins; they will immediately start adding data.
discoveryPlugins.forEach(PluginConstructor=>{
	const plug = new PluginConstructor();
	const name = plug.name;

	// Check for name
	if (name == 'undefined'){
		throw new Error('Malformed plugin: Missing name');
	}

	// attach handlers:
	plug.on(DSPEvents.host,h=>{
		addNewHost(h);
	});

	// Handle errors:
	plug.on(DSPEvents.error,e=>{
		plug.emit(DSPEvents.stop);
		throw new Error('Plugin emitted error: '+e);
	});

	// Temporary handler for messages
	plug.on(DSPEvents.status,s=>{
		console.log('> '+name+' '+s);
	});

	// Start the plugin:
	plug.emit(DSPEvents.start);
	console.log('started '+plug.name);
});

export class DSPool extends EventEmitter {
	constructor(){

		// Not really doing anything yet. Config?
		super();

	}

	// Access the DB directly in memory:
	get foo(){
		return db; 
	}

	// Get a single record out of the array:
	getRecord(index){
		return db[index];
	}


}


