import readPkg from 'read-pkg';
import {cursor} from '../ui/terminalUtils.js';
import os from 'os';


export default async function version(options){

    const pkg = await readPkg();

    cursor.clear();
    console.log('\r');
    console.log('ssht-core v'+pkg.version);
    console.log('ssht-builtins v'+pkg.version);
    console.log('node '+process.version);
    console.log('os v'+os.release());
    console.log('');
    console.log('plugins:');

    
    /* I've removed the ability to get plugin versions for now, because they
    create a circular dependency. It works fine, it's just hacked together */
    console.log('\t[disabled, see ./src/core/version.js]');

    /*
    const getPlugins = (await import('../discovery/pluginLoader.js'))
        .getPlugins;

    const pl = await getPlugins([], options);

    // Read plugin versions:
    for (let p of pl){
        let ver = '';
        let name = '';
        try {
            name = (p.pluginName)
                .replace('../plugins/','/builtin/')
                .trim()
            ver = (await p.meta()).pkg.version;
        } catch (e){
            ver = ' [failed to read version]'
            continue;
        }
        console.log(`\t${name} v${ver}`);
    }
    */

    console.log('');

    // Will exit 0 when finished.
}