import loadingMessage, { doneLoading } from './ui/loadingIndicator.js';
import options from './core/options.js'
import log from './core/logger.js';
import UserInterface from './ui/tui.js';
import Pool from './pool.js';
import { startPlugins } from './discovery/pluginLoader.js';

// We don't need to wrap this, but most AST parsers don't like the top-level
// await just yet. (Even though it's been supported for some time now...) since
// it's technically a stage-3 proposal.

// I include my fork of espree as a dependency that supports top-level-await
// as a dependency until this is formally supported.

export default async function main() {

    log({
        zone: 'main',
        message: 'Library loading completed in',
        data: String(process.uptime())
    })

    log({
        zone: 'process',
        message: 'Master process PID',
        data: String(process.pid)
    })

    log({
        zone: 'main',
        message: 'Parsed options',
        data: options
    })

    //console.log(options, process.pid);

    // Instantiate host pool:
    const pool = new Pool();

    // Connect UI to pool:
    if (!options.headless) {


        doneLoading();
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

    doneLoading();

    for (const plugin of p){
        plugin.on('host', host => {
            pool.addHost({
                type: plugin.name,
                ...host
            });
        });

        // Even if this is async, we just start it and keep going:
        plugin.start()
    }


    process.stdin.on('keypress', function (k, kp) {
        if (kp && kp.ctrl && kp.name == 'c') process.exit();
    });

}

main();