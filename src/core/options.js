import argOptions from './args.js';
import buildEmptyOptions from './buildEmptyOptions.js';
import configOptions from './configFile.js';


// This specifies the 
const options = {
    ...buildEmptyOptions(),
    ...configOptions,
    ...argOptions
}

export default options;

console.log(buildEmptyOptions(), configOptions, argOptions);

console.log(options);
