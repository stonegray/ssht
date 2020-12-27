import args from './args.js';
import getOptions, { buildEmptyOptions } from './configFile.js';
import definitions from './definitions.js';


const options = buildEmptyOptions();

for (const def of definitions){

    const argName = def.argument.substring(2);

    // get CLI options:
    if (args[argName] !== undefined){
        options[def.name] = args[argName];
    }


}



console.log(options);
