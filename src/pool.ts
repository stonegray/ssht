// connection handler
//
//

// Import our plugins:

import { sshPlugin } from './discover/ssh';
import { gcpPlugin } from './discover/gcp';
import { dockerPlugin } from './discover/docker';
import { fooPlugin } from './discover/foo';
import { DSHost } from './shared/interfaces';
import { DSPEvents,DSPlugin } from './dsPlugin';

// register plugins:
const discoveryPlugins = [];
discoveryPlugins.push(fooPlugin);
discoveryPlugins.push(gcpPlugin);
discoveryPlugins.push(sshPlugin);
discoveryPlugins.push(dockerPlugin);


/* 
 *   Pool
 *
 *
 * Keep track of all the discovered hosts.
 * Allow consumer, discovery, and info plugins to attach.
 *
 */


function addNewHost(host:DSHost){
	console.log('Detected new '+host.kind+' host:'+host.name);
	return true;
}


// Register discovery plugins
discoveryPlugins.forEach(PluginConstructor=>{
	const plug = new PluginConstructor();

	// Check for name
	if (typeof plug.name == 'undefined'){
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


	// Start the plugin:
	plug.emit(DSPEvents.start);
});




