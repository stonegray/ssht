import os from 'os';

import networkOptions from './options/network.js';
import sshOptions from './options/ssh.js';
import debugOptions from './options/debug.js';
import preflightOptions from './options/preflight.js';

let definitions = [];


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

// Standard commands:

/* Normally these would be auto generated by yargs, our argument parser, but
there's some weird behaviour with named groups that prevents us from changing
the order. 

As a workaround, we manually define all the builtins (like help, version etc)
and assign them to the "Options" group, which lets us put them at the front.

Relavant issues:
https://github.com/yargs/yargs/issues/152
*/



definitions.push({
	name: 'version',
	default: false,
	type: 'boolean',
	argument: '--version',
	description: "Show version information",
	hidden: false,
	group: 'Options',
	validator: () => true
});

definitions.push({
	name: 'verbose',
	default: false,
	type: 'boolean',
	alias: '-v',
	argument: '--verbose',
	fileId: 'main',
	fileField: 'verbose',
	allowEmpty: false,
	description: "Enable verbose logging",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});

definitions.push({
	name: 'help',
	type: 'boolean',
	// yargs will catch 'help' as well
	argument: '--help',
	allowEmpty: false,
	description: "Show this list of commands",
	group: 'Options',
});

// Plugin options
definitions.push({
	name: 'noplugins',
	default: false,
	type: 'boolean',
	alias: '-P',
	argument: '--noplugins',
	fileId: 'main',
	fileField: undefined,
	allowEmpty: false,
	description: "Do not load any plugins",
	hidden: false,
	conflicts: [],
	group: 'Plugins',
	validator: () => true
});
definitions.push({
	name: 'plugins',
	default: [
		'/builtin/ssh',
	],
	type: 'array',
	alias: '-p',
	argument: '--plugins',
	fileId: 'main',
	fileField: 'plugins',
	allowEmpty: false,
	description: "Force loading a plugin. Specify multiple times to load more  than one",
	hidden: false,
	conflicts: [],
	group: 'Plugins',
	validator: () => true
});


// Features:
definitions.push({
	name: 'dump',
	default: false,
	type: undefined, // can be bool or string
	alias: '-d',
	argument: '--dump',
	fileId: 'main',
	fileField: undefined,
	allowEmpty: false,
	description: "Dump host database to file on exit",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});
definitions.push({
	name: 'headless',
	default: false,
	type: 'boolean', // can be bool or string
	alias: '-H',
	argument: '--headless',
	description: "Run in headless mode for programmatic use",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});

definitions.push({
	name: 'threads',
	default: false,
	type: 'integer', // can be bool or string
	alias: '-t',
	argument: '--threads',
	description: "Number of search threads to use. Defaults to the number of    available CPUs. (currently "+os.cpus().length+") Set to 0 to disable all         concurrency and run the search from the main thread",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});
definitions.push({
	name: 'noConcurrency',
	default: false,
	type: 'boolean', // can be bool or string
	alias: '-C',
	argument: '--no-conc',
	description: "Disable concurrency globally, including plugins.",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});
definitions.push({
	name: 'loggingZone',
	default: false,
	type: 'array', // can be bool or string
	alias: '-z',
	argument: '--zone',
	description: "Enable debug logging for a given pattern. See documentation   for usage of this option",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});
definitions.push({
	name: 'logAllZones',
	default: false,
	type: 'boolean', // can be bool or string
	alias: '-Z',
	argument: '--allzones',
	description: "Log debugging information from all zones. Will result in very large log files, use only when troubleshooting an issue",
	hidden: false,
	conflicts: [],
	group: 'Advanced',
	validator: () => true
});

definitions = definitions.concat(networkOptions);
definitions = definitions.concat(sshOptions);
definitions = definitions.concat(debugOptions);
definitions = definitions.concat(preflightOptions);

export default definitions;