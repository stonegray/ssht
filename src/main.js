import UserInterface from './ui/tui.js';
import options from './core/options.js'
import Pool from './pool.js';
import { startPlugins } from './discovery/pluginLoader.js';

// We don't need to wrap this, but most AST parsers don't like the top-level
// await just yet. (Even though it's been supported for some time now...) since
// it's technically a stage-3 proposal.
export default async function main() {

    console.log(options, process.pid);

    // Instantiate host pool:
    const pool = new Pool();

    // Connect UI to pool:
    if (!options.headless) {
        const ui = new UserInterface();
        ui.on('text', text => {
            pool.search(text);
        });

        pool.on('results', res => {
            ui.updateUIField('resultsSize', res.length);
            ui.results(res.slice(0, 6));
        });

        pool.on('size', size => {
            ui.updateUIField('poolSize', size);
        });
    }


    const p = await startPlugins([
        //'../plugins/foo.js',
        //'../plugins/ssh.js',
        '../plugins/fake.js',
    ]);

    p.forEach(plugin => {
        plugin.on('host', host => {
            pool.addHost({
                type: plugin.name,
                ...host
            });
        });

        // Wait just a sec...
        setTimeout(() => {
            plugin.start()
        }, 100);
    })

    pool.search('asdf');



    process.stdin.on('keypress', function (k, kp) {
        if (kp && kp.ctrl && kp.name == 'c') process.exit();
    });

}

main();