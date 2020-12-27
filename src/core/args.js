import yargs from 'yargs';

import definitions from './definitions.js';

/* In hindsight, it might make sense to implement our own argument parser,
as yargs doesn't do a great job of playing nice with everything else. 

We're using a few weird hacks here, so beware. */

// take an array of defintions, return an object with key-value pairs 

function createYargsObject(definitions) {

    // Create the initial object, then we have to add .options:
    let args = yargs().parserConfiguration({
        'boolean-negation': false
    })

    // Quick helper function:
    function appendOption(yarg, definition) {

        const opt = definition;

        const a = opt.argument.substring(2);
        console.log(opt.argument, a);
        return yarg.option(a, {
            alias: opt.alias,
            description: opt.description,
            type: opt.type,
            hidden: opt.hidden,
            group: opt.group,
            //default: opt.default
        })
    }

    function loadArgs(definitions) {
        for (const def of definitions) {
            const a = appendOption(args, def);
            args = a;
        }
        return args;
    }

    return loadArgs(definitions);
}


// we need to reassemble what yargs gives us back into a usable object:
function remapOutputArray(args){

    const out = {};

    // For each definition, check if it exists in the args output.
    // If it does, fix the name and push into the output object.
    for (const def of definitions){

        const argsName = def.argument.substring(2);

        if (typeof args[argsName] !== 'undefined'){
            out[def.name] = args[argsName];
        }
    }

    return out;
}


const a = await new Promise(resolve => {

    const y = createYargsObject(definitions);

    y.parse(process.argv.slice(2), (a, b, output) => {

        // Remove garbage from the output

        // Issue:
        // https://github.com/yargs/yargs/issues/1145
        // Workaround:
        // https://github.com/yargs/yargs/issues/319

        output = output.replace(/\[\w+\]/g, '');

        // Show the modified output
        if (output.length > 0) {
            console.log(' ')
            console.log(' ')
            console.log('                              ssht v. 2.0.0')
            console.log(' ')
            process.stdout.write(output);
            process.stdout.write('\n');
        }

        const out = remapOutputArray(y.parsed.argv);
        resolve(Object.freeze(out));
    });
});


export default a;