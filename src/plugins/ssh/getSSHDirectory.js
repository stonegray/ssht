import fs from 'fs';
import path from 'path';

import { resolveTilde } from '../../util/fileHelpers.js';

export async function getSSHDirectory(p) {

    let resolvedPath = resolveTilde(p);

    let dirent = await fs.promises.lstat(resolvedPath);

    if (dirent.isFile()) {
        console.error("Found file when searching for user SSH directory");
        // TODO: Throw, this is probably a really broken config file
    }


    // Symbolic link resolution:
    if (dirent.isSymbolicLink()) {

        const link = await fs.promises.readlink(resolvedPath);

        // The symlink could be absolute, eg. "/home/foobar/.config/ssh"
        // or relative, like "~/.config/ssh", we need to handle both
        // cleanly:
        const parsed = path.parse(link);

        if (parsed.root == '/') {

            //console.log('debug: Following SSH folder absolute symlink to ', link);
            // Reassign resolvedPath with contents of symlink:
            resolvedPath = link;

        } else {

            //console.log('debug: Following SSH folder rel symlink to ', link);
            // Build path based on relative link location:
            return Reflect.apply(path.join, null, [
                resolvedPath,
                '..',
                link
            ]);

        }
    }

    // Rescan new path if it's changed:
    dirent = await fs.promises.lstat(resolvedPath);

    if (dirent.isSymbolicLink()) {
        throw new Error('Deep symlinks are unsupported, please file an issue.');
    }

    if (!dirent.isDirectory()) {
        console.warn("User SSH config folder does not exist");
    }

    return resolvedPath;
}
