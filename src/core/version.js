import os from 'os';

import readPkg from 'read-pkg';

import {cursor} from '../ui/terminalUtils.js';


export default async function version(){

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
    /* possible fix is to prevent plugins from requiring options/args and pass
    all options to them on load */
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