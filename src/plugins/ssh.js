import readPkg from 'read-pkg';
import DiscoveryPlugin from '../discovery/prototype.js'

import getHosts from './ssh/getHosts.js';


/* This template implements a DiscoveryPlugin as used by ssht. DiscoveryPlugins
asynchronously retrieve information from a variety of sources, such as scanning
the local machine for running virtual machines.

DiscoveryPlugins pass this information using events. The following events can
be emitted by a DiscoveryPlugin, any others are invalid:

 - add          Used on discovery to add hosts to the host pool.
 - status       Human-readable status information, shown while in info mode
 - percentage   Optional floating point indicator of progress.
 - debug        Non-fatal errors and warnings that should be logged to disk
 - error        Fatal errors that should be shown to the user.         
 - done         

*/

export default class SSHPlugin extends DiscoveryPlugin {
    constructor(){
        super();

        this.name = "SSH";
        this.description = "Reads local ~/.ssh/config files"
    }

    /* The start command instructs the plugin to begin searching for hosts
     * and emitting 'host' events when it finds new ones. */
    start(){

        this.emit('status', "Starting up...")
        this.emit('percentage', 0.0)

        ;(async ()=>{

            const hosts = await getHosts();

            // Ideally we'd emit them as we get them instead of caching
            // them all, but this seems to work well enough.
            for (const h of hosts){
                this.emit('host', h);
            }

            this.emit('percentage', 1.00);
            this.emit('done');

        })();
    }

    /* The stop command instructs the plugin to stop searching for hosts.
     * Any hosts discovered after this will throw an error. This will be called
     * as a destructor before the process exits or connects to a host. */
    stop(){
        // Stop searching, perform any cleanup tasks. 
        this.emit('status', "Stopped")
    }
}

// Leave this here, used to collect package information for external packages:
export async function meta(){
    return {
        pkg: await readPkg(),
        path: import.meta.url
    } 
}