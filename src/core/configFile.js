import fs from 'fs';
import path from 'path';

import { resolveTilde } from '../util/fileHelpers.js';
import readJSONSync from '../util/readJSONSync.js';
import buildEmptyOptions from './buildEmptyOptions.js'

const optionsFile = "built/options.json"

function initializeOptionsFile() {

    const opts = buildEmptyOptions();

    const str = JSON.stringify(opts, null, 2);

    const filePath = resolveTilde(optionsFile);

    const configDir = path.dirname(filePath);

    fs.mkdirSync(configDir, {
        recursive: true
    });

    fs.writeFileSync(filePath, str, {
        encoding: 'utf-8'
    })

}


export function getOptions() {

    const resolved = resolveTilde(optionsFile);

    if (!fs.existsSync(resolved)) {
        initializeOptionsFile();
    } 

    let options = readJSONSync(resolved);

    // TODO: better handling of malformed files
    if (options == null){
        initializeOptionsFile();
        options = readJSONSync(resolved);
    }

    // If we still can't write, just use default options
    // and warn the user.
    if (options == null){
        // TODO: Error handling
        console.error('ERROR: Failed to write options.json');
        return buildEmptyOptions();
    }

    return options;

}

const configOptions = getOptions();

export default configOptions;
