import fs, { read } from 'fs';
import path from 'path'

import glob from 'glob';

import { resolveTilde } from '../../util/fileHelpers.js';
import readSSHConfigFile from './readFile.js'

//import glob from 'glob';
//import sshConfigParser from 'ssh-config';

//kkimport iterableFsList from '../../util/iterableFsList.js';

const sshRootPath = "~/.ssh"

const sshConfigFile = './config';


export async function getSSHDirectory(p){

    let resolvedPath = resolveTilde(p);

    let dirent = await fs.promises.lstat(resolvedPath);

    if (dirent.isFile()){
        console.error("Found file when searching for user SSH directory")
        // TODO: Throw, this is probably a really broken config file
    }


    // Symbolic link resolution:
    if (dirent.isSymbolicLink()){

        const link = await fs.promises.readlink(resolvedPath);

        // The symlink could be absolute, eg. "/home/foobar/.config/ssh"
        // or relative, like "~/.config/ssh", we need to handle both
        // cleanly:

        const parsed = path.parse(link);

        if (parsed.root == '/'){

            //console.log('debug: Following SSH folder absolute symlink to ', link);
            
            // Reassign resolvedPath with contents of symlink:
            resolvedPath = link;

        } else {

            //console.log('debug: Following SSH folder rel symlink to ', link);
            // Build path based on relative link location:
            return path.join.apply(null, [
                resolvedPath,
                '..',
                link
            ])

        }
    }

    // Rescan new path if it's changed:
    dirent = await fs.promises.lstat(resolvedPath);

    if (dirent.isSymbolicLink()){
        throw Error('Deep symlinks are unsupported, please file an issue.');
    }

    if (!dirent.isDirectory()){
        console.warn("User SSH config folder does not exist");
    }

    return resolvedPath;
}

const asyncGlob = (pattern, options) => {
    return new Promise((resolve, reject) => {
        //console.log("Glob searching", pattern);
        glob(pattern, options, function (err, files) {

            // This is best-effort, so if we hit an error we just stop.
            if (err) resolve(null);

            console.log('Returned glob search', files, pattern);
            resolve(files);
        })
    })
}


export async function recursiveConfigRead(){
    const sshRoot = await getSSHDirectory(sshRootPath);

    const configPath = path.join(sshRoot, sshConfigFile);

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
            const config = await readSSHConfigFile(file);

            // Prevent looped recursion, if we've seen the file before, skip it:
            if (readFiles.includes(file)) continue;
            readFiles.push(file);

            console.log(config);
            // Check if we need to recurse:
            for (const token of config) {
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





console.log('DONE!', await recursiveConfigRead());