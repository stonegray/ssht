import buildEmptyOptions from './buildEmptyOptions.js';
import configOptions from './configFile.js';
import argOptions from './args.js';

import version from './version.js';

const options = Object.freeze({
    ...buildEmptyOptions(),
    ...configOptions,
    ...argOptions
});

if (options.version) {
    version(options).then(() => {
        process.exit(0);
    })
}

export default options;