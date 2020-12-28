import yargs from 'yargs';
import definitions from './definitions.js';
import readPkg from 'read-pkg';

/* In hindsight, it might make sense to implement our own argument parser,
as yargs doesn't do a great job of playing nice with everything else. 

We're using a few weird hacks here, so beware. Notably we're abusing top-level
await to stop the entire process until the yargs callback returns */

/* Yargs expects a chain of .option().option().option() to configure it,
so we're using a quick helper function that returns a .option()'d copy
and iterating through our definitions array instead */
function createYargsObject(definitions) {

    // Create the initial object, then we have to add .options:
    let args = yargs().parserConfiguration({
        'boolean-negation': false
    })

    // Quick helper function:
    function appendOption(yarg, definition) {

        const opt = definition;

        const a = opt.argument.substring(2);
        //console.log(opt.argument, a);
        return yarg.option(a, {

            // es2020 optional chaining opr:
            alias: opt.alias?.substring(1),
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


function getUsageString(definitions){

    const optionAliases = {
        lower: [],
        upper: [],
        other: []
    }
    
    for (const d of definitions){
        if (typeof d.alias !== 'string') continue;

        const alias = d.alias.slice(1);

        // Skip invalid lengths:
        if (alias.length !== 1) continue;

        if (alias == alias.toUpperCase()){
            optionAliases.upper.push(alias);
        }

        if (alias == alias.toLowerCase()){
            optionAliases.lower.push(alias);
        }
    }
    
    const output = [
        ...optionAliases.lower.sort(),
        ...optionAliases.upper.sort(),
        ...optionAliases.other
    ].join('')

    return output;

}


const a = await new Promise(resolve => {

    const y = createYargsObject(definitions);

    y.parse(process.argv.slice(2), async (a, b, output) => {

        // Remove garbage from the output

        // Issue:
        // https://github.com/yargs/yargs/issues/1145
        // Workaround:
        // https://github.com/yargs/yargs/issues/319

        output = output.replace(/\[\w+\]/g, '');
        
        const pkg = await readPkg();

        // Show the modified output
        if (output.length > 0) {
            console.log(' ')
            console.log(' ')
                      //--------------------------------------------------------------------------------
            console.log('                                ssht v'+pkg.version);
            console.log(' ')
            //console.log('                      https://github.com/stonegray/ssht');
            //console.log(' ')
            console.log('_______________________________________________________________________________')
            console.log('')
            console.log('Usage')
            console.log('\tssht [-'+getUsageString(definitions)+'] [options] [query...] [-- sshargs...]');
            console.log('')
            process.stdout.write(output);
            process.stdout.write('\n');
        }


        // There doesn't appear to be any good way to see if yargs has printed
        // the help message to the terminal, which we need to catch before we
        // start drawing the UI.

        // As a temporary fix, I'm going to just exit if yargs produces any
        // output.

        // TODO: Find better solution
        if (output.length > 0){
            process.exit();
        }

        const out = remapOutputArray(y.parsed.argv);
        resolve(Object.freeze({
            argv: y.parsed.argv._,
            ...out
        }));
    });
});


export default a;