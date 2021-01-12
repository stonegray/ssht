import path from 'path';
import os from 'os';

/* When splitting paths, the root is not respected which can
 * lead to the paths root being changed when it is reassembled.
 *
 * This helper function splits the path, fixes a broken root, 
 * checks that it can be reasseembled, and throws an error if it can't. 
 */
// FIXME: The rebuild fails on paths that begin with "./" 
export function safePathSplit(string){

	if (typeof string !== 'string'){
		console.error(string, typeof string);
		throw new Error('Invalid type, expected string, got '+typeof string + string);
	}

	const arr = string.split(path.sep);

	const parsed = path.parse(string);
    
	// Check our root:
	if (parsed.root.length > 0) {
		arr.unshift(parsed.root);
	}

	// Check that trailing slashes are respected, even though they don't do anything:
	const rebuildArray = arr;
	if (string.slice(-1) === '/'){
		rebuildArray.push(string.slice(-1));
	}

	// Rebuild test:
	const rebuilt = path.join.apply(null, rebuildArray);

	// Can we put humpty dumpty back together again?
	if (rebuilt !== string){
		const message = [
			'WARN: destructive path seperation: ',
			`Expected: "${string}", got "${rebuilt}"`
		].join('');

		throw new Error(message);
	}

	return arr;
}

// Does what it says on the tin, should be pretty resilliant against invalid
// inputs but more testing is needed.
export function resolveTilde(pathString, home){

	if (typeof pathString !== 'string'){
		console.error(pathString, typeof pathString);
		throw new Error('Invalid type, expected string, got '+typeof pathString + pathString);
	}

	const homeDirArray = safePathSplit(home || os.homedir());
   
	let pathArray = safePathSplit(pathString); 

	// Since we're working with a tokenized path instead of a string, we don't
	// need to check for edge cases like "~user/" or "~+", as this will only 
	// match a literal ~.
	if (pathArray[0] === '~') {
		pathArray.shift();
		pathArray = [...homeDirArray, ...pathArray];
	}

	return path.join.apply(null, pathArray);
}