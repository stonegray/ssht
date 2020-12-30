

import DiscoveryPlugin from './prototype.js';

// Precache plugins to improve launch times:
/* eslint-disable no-unused-vars */
import SSHPlugin from '../plugins/ssh.js'
import FakePlugin from '../plugins/fake.js'
import DockerPlugin from '../plugins/docker.js'
/* eslint-enable no-unused-vars */

import options from '../core/options.js';
import log from '../core/logger.js';
const zone = 'pluginLoader';

async function getPlugins(pluginNames){

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
        try {
            const imp = await import(name);
            plugins.push(imp.default);
        } catch (error) {
            error.name = name;
            plugins.push(error);
        }
    }

    return plugins;
}


async function readPluginMeta(plugin){

    let pl = {};

    try {
        pl = await plugin.meta();
        
    } catch(e){
        return Error('Failed to read plugin metadata: '+e.message);
    }

    const meta = {
        version: pl.version,
        name: pl.name,
        description: pl.description,
    }

    return meta;
}

export async function startPlugins(pluginNames){

    const pluginConstructors = await getPlugins(pluginNames);
    const plugins = [];

    const pluginMeta = [];

    for (const Plugin of pluginConstructors) {

        if (Plugin instanceof Error) {
            console.error(`Failed to load ${Plugin.name}: ${Plugin.message}`);
            continue;
            //TODO: Error handling
        }

        let p;

        // Instantiate plugin
        try {
            p = new Plugin();
        } catch (e){
            console.error(`Failed to instantiate ${Plugin.name}: ${e.message}`);
            continue;
        }

        // Check plugin metadata:
        try {
            p._pkg = await readPluginMeta(p);

            if ( p._pkg instanceof Error) throw (p._pkg);

            pluginMeta.push(p._pkg);
        } catch (e){
            console.error(`Failed to get plugin metadata for ${Plugin.name}: ${e.message}`);
            continue;
        }
        if (typeof p.name !== 'string' && p.name.length > 1){
            console.error(`Malformed plugin ${Plugin.name}: invalid name property`);
            continue;
        }
        if (typeof p.description !== 'string' && p.description.length > 1){
            console.error(`Malformed plugin ${Plugin.name}: invalid description property`);
            continue;
        }

        // Run sanity checks:

        // eslint-disable-next-line no-prototype-builtins
        if (! DiscoveryPlugin.isPrototypeOf(Plugin)){
            console.error(`Malformed plugin ${Plugin.name}: Invalid class parent`);
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
    })
    
    return plugins;
}




const Discover = 32;
export default Discover;