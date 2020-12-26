import yargs from 'yargs';



const option = {

    // Value:
    default: false,
    type: 'boolean',

    validator: val => {
        return (!!val || !val);
    },

    // Argument options:
    alias: '-v',
    argument: '--verbose',

    // Config file options:
    fileId: 'main',
    // Set true to allow missing field in the config file,
    // set false to write the default value in if missing.
    allowEmpty: true

}



const args = yargs()
    /*
    .example([
        ['$0 --config "~/config.json"', 'Use custom config'],
        ['$0 --safe', 'Start in safe mode']
    ])*/
    .option('plugin', {
        alias: 'p',
        type: 'array',
        description: 'Force loading a specific plugin (overrides the --noplugins and --nobuiltins switch if specified)'
    })
    .option('noplugins', {
        type: 'boolean',
        description: 'Don\'t load any non-builtin plugins'
    })
    .option('verbose-logging', {
        type: 'boolean',
        description: 'Write detailed logs, use for reporting issues'
    })
    .epilogue('For more information, see our docs at https://github.com/stonegray/ssht')
    .parse(process.argv.slice(2), (a, b, output) => {
        // Remove types (e.g. [string], [boolean]) from the output
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
    });


console.log('running');

export default Object.freeze({ ...args });