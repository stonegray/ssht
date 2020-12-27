import definitions from './definitions.js';

// We need to build an empty objects array from the definition file
// on startup, as well as when we're rebuilding the config file.

export default function buildEmptyOptions() {

    // Create empty object structure:
    const o = {

        // Future use, if we introduce any breaking changes into our config
        // file we can increment the _configVersion and reject older versions
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
