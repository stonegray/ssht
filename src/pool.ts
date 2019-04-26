// connection handler
//
//

// Import our plugins:
import { fooPlugin } from './discover/foo';
import { DSHost } from './shared/interfaces';
import { DSPEvents,DSPlugin } from './dsPlugin';

// register plugins:
const discoveryPlugins = [];
discoveryPlugins.push(fooPlugin);



/* 
 *   Pool
 *
 *
 * Keep track of all the discovered hosts.
 * Allow consumer, discovery, and info plugins to attach.
 *
 */


function addNewHost(host:DSHost){
	console.log('Detected new host:'+host.name);
	return true;
}


// Register discovery plugins
discoveryPlugins.forEach(PluginConstructor=>{
	const plug = new PluginConstructor();

	// Check for name
	if (typeof plug.name){
		throw new Error('Malformed plugin: Missing name');
	}

	// attach handlers:
	plug.on(DSPEvents.host,h=>{
		addNewHost(h);
	});

	// Handle errors:
	plug.on(DSPEvents.error,e=>{
		plug.emit(DSPEvents.stop);
	});


	// Start the plugin:
	plug.emit(DSPEvents.start);
});




