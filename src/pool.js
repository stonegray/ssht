
import search from './search.js';


/* 
export interface DSHost {
	
	/* Required values
	 * - uuid (optional for now)
	 * - name
	 * - fqdn
	 * - ssh command
	 *

	// Unique identifier. This is used or maintinag the host database, and must
	// be unique. This is to allow updating information about the host.
	uudd?: string; 

	// Human readable name of the host. 
	name: string; 

	// FQDN or IP of host.
	fqdn: string;

	// SSH Settings:
	username?: string;
	port?: number;
	family?: string;
	bindaddress?: string;
	bindinterface?: string;

	// SSH command to use when connecting.
	ssh: string;

	// Status information
	ping?: number;

	// Usually your plugin name, eg 'docker'
	kind?: string;

	// Additional human readable content
	comment?: string;

    // Additional computer readable data
    meta?: [string]
} */
// Store a giant array of all discovered hosts
export default class Pool {
    constructor(){

        // 
    }


    updateHost(uuid){

    }
    addHost(host){

        return 'uuid';
    }
    removeHost(host){

    }

    
}