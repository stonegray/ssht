import readPkg from 'read-pkg';
import randomWords from 'random-words';

import DiscoveryPlugin from '../discovery/prototype.js'


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
 - done         Emit this exactly one time when your plugin is finished
                running and no more hosts will be emitted.

*/

export default class FakePlugin extends DiscoveryPlugin {
    constructor(){
        super();

        this.name = "Fake";
        this.description = "Inserts fake hosts for testing"
    }

    /* The start command instructs the plugin to begin searching for hosts
     * and emitting 'host' events when it finds new ones. Any hosts emitted
     * before the plugin recieves the start() command are non-fatal errors */
    start(){

        this.emit('status', "Inserting fake hosts...")

        const count = 4000;
        const delay = 0.1;

        // Make an empty array of size n
        const output = [...new Array(count)].map(()=>({
            name: randomWords(2).join('-'),
            fqdn: randomWords(3).join(),
            username: randomWords(1).join(''),
            port: 22,
            uuid: 'million',
            ssh: ''
        }));
      
        // Slowly emit them:
        let timer = setInterval(()=>{

            // If there's nothing more to do, cancel the iterator:
            if (output.length == 0) {
                clearInterval(timer);
                this.emit('done');
            }

            // Otherwise pop a fake host and send it:
            this.emit('host', output.pop());

            // Update percentage:
            this.emit('percentage', 1-(output.length / count));

        }, delay);
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