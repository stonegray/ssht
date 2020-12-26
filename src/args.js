import yargs from 'yargs';


const args = yargs()
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .option('noplugins', {
        type: 'boolean',
        description: 'Don\'t load any non-builtin plugins'
    })
    .option('plugin', {
        alias: 'v',
        type: 'array',
        description: 'Force loading a specific plugin (overrides --noplugins)'
    })
    .parse(process.argv.slice(2), (a, b, output) => {
        // Remove types (e.g. [string], [boolean]) from the output
        output = output.replace(/\[\w+\]/g, '');

        // Show the modified output
        console.log(output);
    });

export default Object.freeze({ ...args });