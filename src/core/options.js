import argOptions from './args.js';
import buildEmptyOptions from './buildEmptyOptions.js';
import configOptions from './configFile.js';

const options = Object.freeze({
    ...buildEmptyOptions(),
    ...configOptions,
    ...argOptions
});

export default options;
