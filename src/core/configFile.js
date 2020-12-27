import fs from 'fs';
import path from 'path';

import { resolveTilde } from '../util/fileHelpers.js';
import readJSONSync from '../util/readJSONSync.js';
import definitions from './definitions.js'

const optionsFile = "options.json"

export function buildEmptyOptions() {

    const o = {
        _configVersion: 2
    };

    for (const def of definitions) {
        if (def.allowEmpty == false) {
            o[def.fileField] = def.default;
        }
    }

    return o;
}

function initializeOptionsFile() {

    console.log("rebuilding...");

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
    console.log('Rebuilt options file ', filePath)

}


export default function getOptions() {

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
        console.error('Failed to write options.json');
        return buildEmptyOptions();
    }


    return options;

}

