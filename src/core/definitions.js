const definitions = []

/*

This file contains the defintions for all configuration options for the program.
Each object in the array can contain the following:

    name        Primary name of the option, used when accessing the options
                object.
    description String used in the --help page
    default     Specify a default value. This will be written into the
                options.json file on creation, and will be used if no
                input is specified as an argument.
    type        Specify type of value, accept 'string', 'array',
                'boolean',
    argument    Command line argument, eg '--foobar'
    alias       Short argument, eg '-f'
    fileId      Future use, specifies which file the value should be stored in
    fileField   Object key name used when reading/writing to file
    allowEmpty  If set false, the value is required in the options.json file and
                will be written if it is not present. When true, the value is
                not required but the default is still enforced.
    hidden:     Don't show when viewing --help entries. Does not affect ability
                to access.k
    group       Specifies the group heading when viewing the --help entries.
    conflicts   Prevents use 
    validator   Future use, will be used to accept or reject command line arg
                inputs on launch.
*/

definitions.push({
    name: 'verbose',
    default: false,
    type: 'boolean',
    alias: 'f',
    argument: '--verbose',
    fileId: 'main',
    fileField: 'verbose',
    allowEmpty: false,
    description: "Enable verbose logging",
    hidden: false,
    conflicts: [],
    group: undefined,
    validator: val => {
        return (!!val || !val); // dumb choice for an example
    }
});
definitions.push({
    name: 'barf',
    default: false,
    type: 'boolean',
    alias: undefined,
    argument: '--no-plugins',
    fileId: 'main',
    fileField: undefined,
    allowEmpty: false,
    description: "Disable plugin loading",
    hidden: false,
    conflicts: [],
    group: undefined,
    validator: val => {
        return (!!val || !val); // dumb choice for an example
    }
});
definitions.push({
    name: 'foobar',
    default: false,
    type: 'boolean',
    alias: undefined,
    argument: '--noplugins',
    fileId: 'main',
    fileField: undefined,
    allowEmpty: false,
    description: "Disable plugin loading",
    hidden: false,
    conflicts: [],
    group: undefined,
    validator: val => {
        return (!!val || !val); // dumb choice for an example
    }
});

export default definitions;