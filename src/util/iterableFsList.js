import { resolve } from 'path';
import { promises as fs } from 'fs';

// getFiles was borrowed from qwtel's answer on StackOverflow:
// https://stackoverflow.com/a/45130990
// Licenced CC-BY-SA 4.0 https://stackoverflow.com/help/licensing
// Modified to support recursion across symlinks

export default async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
        yield res;
    }
  }
}

// usage:
/* for await (const f of getFiles('.')) 
    console.log(f);
} */
