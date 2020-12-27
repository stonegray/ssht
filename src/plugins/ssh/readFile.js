import fs from 'fs';

// Basically just readfile with a conservative timeout to prevent
// hanging the resolution of the promise

export default async function readSSHConfigFile(filename){

    let contents = null

    // eslint-disable-next-line no-undef
    //const timeout = new AbortController();

   // const timeoutMillis = 100;

    /*const timer = setTimeout(()=>{
        timeout.abort();
        console.warn("WARN: Aborted reading file due to timeout")
        // We can run cleanup code here innstead of *signal.onabort...
    }, timeoutMillis);
*/
    try {
        contents = await fs.promises.readFile(filename, {
            encoding: 'utf-8',
 //           signal: timeout.signal
        })

  //      clearTimeout(timer);
    } catch (e){
        console.warn("Error reading file", e);
    }

    return contents;
}
