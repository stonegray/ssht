


// Precache plugins to improve launch times:
/* eslint-disable no-unused-vars */
import SSHPlugin from '../plugins/ssh.js';
import FakePlugin from '../plugins/fake.js';
import DockerPlugin from '../plugins/docker.js';
/* eslint-enable no-unused-vars */
import options from '../core/options.js';
import log from '../core/logger.js';

import DiscoveryPlugin from './prototype.js';

const zone = 'pluginLoader';

export async function getPlugins(pluginNames, options){

    let pluginsToLoad = pluginNames;
    

    // Respect noPlugins options:
    if (options.noplugins){
        pluginsToLoad = [];
    }

    // If plugins is a non-zero length array, add it to the list of plugins
    // that we should load. This comes from --plugin args:
    // We're using implicit bool here, if length is 0 it's falsy:
    if (Array.isArray(options.plugins)){
        pluginsToLoad = pluginsToLoad.concat(options.plugins);
    }

    // Convert '${builtin}/foo' to '../plugins/foo.js'
    pluginsToLoad = pluginsToLoad.map(p => p.replace('/builtin/', '../plugins/') + ".js");

    const plugins = [];
    
    for (const name of pluginsToLoad){

        let imported = {};
        let error = null;
        
        try {
            imported = await import(name);
        } catch (e) {
            error = e;
            throw error;
        }

        plugins.push({
            name,
            error,

            // adds .default and .meta if they exist:
            ...imported
        });
    }

    // Returns array of objects or error
    // object is {
    //      default: class extending DiscoveryPlugin,
    //      pluginName: string,
    //      meta: async functione
    // }
    
    return plugins;
}


export async function startPlugins(pluginNames){

    const pluginConstructors = await getPlugins(pluginNames, options);
    const plugins = [];
    const pluginMeta = [];

    for (const thisPlugin of pluginConstructors) {


        if (thisPlugin.error) {
            console.error(`Failed to load ${thisPlugin.name}: ${thisPlugin.message}`);
            continue;
            //TODO: Error handling
        }


         
        // get constructor:
        let Plugin = thisPlugin.default;

        // allocate variable for instantiated plugin 
        let p;

        // Instantiate plugin
        try {
            p = new Plugin();
        } catch (e){
            console.error(`Failed to instantiate ${thisPlugin.name}: ${e.message}`);
            console.error(e);
            continue;
        }

        // Check that required information is added:
        if (typeof p.name !== 'string' && p.name.length > 1){
            console.error(`Malformed plugin ${thisPlugin.name}: invalid name property`);
            continue;
        }
        if (typeof p.description !== 'string' && p.description.length > 1){
            console.error(`Malformed plugin ${thisPlugin.name}: invalid description property`);
            continue;
        }

        // Run sanity checks:

        // eslint-disable-next-line no-prototype-builtins
        if (!DiscoveryPlugin.isPrototypeOf(Plugin)) {
            console.error(`Malformed plugin ${thisPlugin.name}: Invalid class parent`);
            continue;
        }

        if (typeof p.start !== 'function'){
            console.error(`Malformed plugin ${Plugin.name}: missing start() method`);
            continue;
        }
        if (typeof p.stop !== 'function'){
            console.error(`Malformed plugin ${Plugin.name}: missing start() method`);
            continue;
        }
       
        // Add to plugin array:
        plugins.push(p);
    }

    log({
        zone, 
        message: "Loaded plugins",
        data: {
            total: pluginConstructors.length,
            plugins: pluginMeta
        }
    });
    
    return plugins;
}




const Discover = 32;
export default Discover;