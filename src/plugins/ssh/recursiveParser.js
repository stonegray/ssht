import fs from 'fs';
import path from 'path'

import sshConfigParser from 'ssh-config'
import glob from 'glob';

import { resolveTilde } from '../../util/fileHelpers.js';
import { getSSHDirectory } from './getSSHDirectory.js';
import readSSHConfigFile from './readFile.js'
import options from '../../core/options.js';
import log from '../../core/logger.js'

const sshRootPath = "~/.ssh"
const sshConfigFile = './config';

const asyncGlob = (pattern, options) => {
    return new Promise((resolve) => {
        //console.log("Glob searching", pattern);
        glob(pattern, options, function (err, files) {

            // This is best-effort, so if we hit an error we just stop.
            if (err) resolve(null);

            resolve(files);
        })
    })
}

export default async function recursiveParser(){

    const sshRoot = await getSSHDirectory(sshRootPath);

    let configPath = path.join(sshRoot, sshConfigFile);

    // Check if the user has supplied a readable config file. If so,
    // use it insead of the detected configPath.
    if (options.sshConfigFile == 'string'){
        try {
            let userPath = resolveTilde(options.sshConfigFile);

            const canRead = await fs.promises.access(
                userPath, fs.constants.R_OK
            );

            if (canRead) configPath = userPath;

        } catch (e){

            log({
                zone: 'plugin.ssh.recursiveParser',
                message: "Failed to load user specified SSH config file",
                data: {
                    path: String(options.sshConfigFile),
                    error: e
                }
            })
        }
    }

    // Check if it's a file:
    let dirent = await fs.promises.lstat(configPath);
    if (!dirent.isFile()){
        console.log('Missing SSH config, stopping')
        return false;
    }

    const tokens = [];
    const readFiles = [];
    const globOptions = {
        cwd: sshRoot,
        dot: true,
    };

    // This is used by the glob solver to determine the order:
    let counter = 0;

    // Recursive config parser:
    const readConfig = async (configPath)=>{

        // Skip any null paths, there are a few edges cases that this can occur:
        if (configPath === null) return;

        // 
        const files = await asyncGlob(await resolveTilde(configPath), globOptions);

        // asyncGlob can return null if it fails to parse, this is a "best-effort" 
        // attempt so if it fails, just skip:
        if (files === null) return;


        for (const file of files) {
            const config = sshConfigParser.parse(
                await readSSHConfigFile(file)
            );

            // Prevent looped recursion, if we've seen the file before, skip it:
            if (readFiles.includes(file)) continue;
            readFiles.push(file);

            // Check if we need to recurse:
            for (const token of config) {

                // Store position for the glob solver:
                token.position = counter++;

                if (token.param == "Include") {

                    // Recurse:
                    await readConfig(token.value);

                } else {
                    // If it's data, not an include, add it here:
                    tokens.push(token);
                }
            }
        }
    }

    await readConfig(configPath);

    return tokens;
}




