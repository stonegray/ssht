

import DiscoveryPlugin from './prototype.js';

// Precache plugins to improve launch times:
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */

async function getPlugins(pluginNames){

    const plugins = [];

    for (const name of pluginNames){
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

export async function startPlugins(pluginNames){

    const pluginConstructors = await getPlugins(pluginNames);
    const plugins = [];

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
            p._pkg = await p.meta();
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
    return plugins;
}




const Discover = 32;
export default Discover;