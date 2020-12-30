import buildEmptyOptions from './buildEmptyOptions.js';
import configOptions from './configFile.js';
import argOptions from './args.js';

const options = Object.freeze({
    ...buildEmptyOptions(),
    ...configOptions,
    ...argOptions
});


export default options;