import readPkg from 'read-pkg';
import DiscoveryPlugin from '../discovery/prototype.js'

import getContainers from './docker/getContainers.js';


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

*/

export default class FooPlugin extends DiscoveryPlugin {
    constructor(){
        super();

        this.name = "Foo";
        this.description = "Example builtin plugin that does nothing."
    }

    /* The start command instructs the plugin to begin searching for hosts
     * and emitting 'host' events when it finds new ones. Any hosts emitted
     * before the plugin recieves the start() command are non-fatal errors */
    start(){

        const containers = getContainers();

        this.emit('status', "Starting up...")
        this.emit('percentage', 0.10)

        // Get your hosts:
        this.emit('percentage', 0.99)
        this.emit('host', []);

        this.emit('done');
    }

    /* The stop command instructs the plugin to stop searching for hosts.
     * Any hosts discovered after this will throw an error. This will be called
     * as a destructor before the process exits or connects to a host. */
    stop(){
        // Stop searching, perform any cleanup tasks. 
        this.emit('status', "Stopped")
    }

    // Leave this here, used to collect package information for external packages:
    async meta() { return await readPkg() }
}