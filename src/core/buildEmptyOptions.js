import definitions from './definitions.js';

// If the minimal argument is set, it outputs only required parameters.
// By default, any option with a 'default' parameter is 

export default function buildEmptyOptions() {

    // Create empty object structure:
    const o = {
        _configVersion: 2
    };

    for (const def of definitions) {
        if (def.allowEmpty == false) {

            // If we don't have a default, skip it:
            if (typeof def.default === 'undefined')
                continue;

            // Likewise, if there's no file field, skip. Options
            // with no defined fileField can't be loaded from file
            // and must be specified on the command line
            if (typeof def.fileField === 'undefined')
                continue;

            o[def.fileField] = def.default;
        }
    }

    return o;
}
