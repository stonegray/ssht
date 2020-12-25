import {EventEmitter} from 'events';

/*
export enum DSPEvents {

	// Plugins listen for:
	start = 'START',
	stop = 'STOP',

	// Plugins emit:
	debug = 'DEBUG',
	status = 'STATUS',
	percentage = 'PERC',
	error = 'ERROR',
	host = 'HOST',
}

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
}
*/

export default class DiscoveryPlugin extends EventEmitter {
    constructor(){
        super();
    }

	addHost(host){
		return 'uuid';
	}

	updateHost(update){

	}


	error(data){

	}
	debug(data){

	}
	status(data){

	}
	percentage(float){

	}
}

