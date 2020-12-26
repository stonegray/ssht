import UserInterface from './ui/tui.js';
import Pool from './pool.js';
import { startPlugins } from './discovery/pluginLoader.js';

const ui = new UserInterface();

const pool = new Pool();

const p = await startPlugins([
    //'../builtins/foo.js',
    //'../builtins/ssh.js',
    '../builtins/fake.js',
]);


p.forEach(plugin => {
    plugin.on('host', host => {
        pool.addHost({
            type: plugin.name,
            ...host
        });
    });

    plugin.start();
})

ui.on('text', text => {
    pool.search(text);
});

pool.on('results', res => {
    ui.updateUIField('resultsSize', res.length);
    ui.results(res.slice(0, 6));
});

pool.on('size', size =>{
    ui.updateUIField('poolSize', size);
});



process.stdin.on('keypress', function (k, kp) {
	if (kp && kp.ctrl && kp.name == 'c') process.exit();
});

import Discover from './discovery/pluginLoader.js'



const frame = 32;
export default frame;