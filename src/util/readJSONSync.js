import fs from 'fs';
import path from 'path';

import { resolveTilde } from './fileHelpers.js';

export default function readJSONSync(filePath) {

    const resolved = resolveTilde(filePath);

    try {
        const string = fs.readFileSync(path.resolve(resolved), {
            encoding: 'utf-8'
        })

        return JSON.parse(string);

    } catch (e) {
        console.error(e)
        return null;
    }
}