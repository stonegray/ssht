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
	 * - fqdn
	 * - ssh command
	 *\/

	// Unique identifier. This is used or maintinag the host database, and must
	// be unique. This is to allow updating information about the host.
	uudd?: string; 

	// Human readable name of the host, optional
	name?: string; 

	// FQDN or IP of host.
	fqdn: string;

	// SSH Settings:
	username?: string;
	port?: number;
	family?: string;
	bindaddress?: string;
	bindinterface?: string;

	// Extended (-o) SSH options:
	sshOptions?: {
		proxyCommand?: string;
	}

	// SSH command to use when connecting.
	ssh: string;

	// Usually your plugin name, eg 'docker'
	kind?: string;

	// Meta information
	meta?: {

		// Disable host checking
		moCheck?: boolean;

		// Force host checking to see host as online
		alive?: boolean;
	}

	// Status information as determined by HostChecker
	status: {

		// One of the valid states defined in ./src/preflight/README.md
		state: 'PENDING',

		// Whether host is online
		alive: boolean;

		// Ping time in milliseconds
		ping?: number;
	}

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

