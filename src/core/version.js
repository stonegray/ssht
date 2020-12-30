import readPkg from 'read-pkg';
import {cursor} from '../ui/terminalUtils.js';
import os from 'os';

export default async function version(options){

    const pkg = await readPkg();

    cursor.clear();
    console.log('\r');
    console.log('ssht-core v'+pkg.version);
    console.log('builtins v'+pkg.version);

    const getPlugins = (await import('../discovery/pluginLoader.js')).getPlugins;
    const pl = await getPlugins([], options);

    // Read plugin versions:
    for (let p of pl){
        let ver = '';
        let name = '';
        try {
            ver = (await p.meta()).pkg.version;
            name = (p.pluginName)
                .replace('../plugins/','')
                .trim()
        } catch (e){
            continue;
        }
        console.log(`plugin: ${name} ${ver}`);
    }

    console.log('node '+process.version);
    console.log('os v'+os.release());
}