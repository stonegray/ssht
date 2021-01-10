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
	 * - id (optional for now)
	 * - fqdn
	 * - type
	 * - ssh command
	 *\/

	// Unique identifier. This is used or maintinag the host database, and must
	// be unique. This is to allow updating information about the host.
	identifier?: number; 

	// Human readable name of the host, optional
	name?: string; 

	// FQDN or IP of host.
	fqdn: string;

	// Type of host, eg. SSH or AWS (basically plugin name)
	type: string;

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

	// These parameters can optionally be supplied to influence how
	// HostChecker processes the host
	checker?: {

		// Disable host checking
		noCheck?: boolean;

		// Force host checking to see host as online
		forceAlive?: boolean;

		// Force using a different FQDN to perform the host check
		// This is used for compatibility with SSH's ProxyJump, we should
		// check the proxy's state instead of the destination host
		forceFqdn: string;

	}

	// Status information as determined by HostChecker
	// This is undefined unless set by HostChecker
	status: {

		// One of the valid states defined in ./src/preflight/README.md
		state: 'PENDING',

		// Whether host is online
		alive: boolean;

		// Ping time in milliseconds
		ping?: number;

		// True if the IP is within or resolves to a private range 
		private?: boolean;

		// SSH server version
		serverVersion?: string | undefined;
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

	updateHost(update){}


	error(data){}
	debug(data){}
	status(data){}
	percentage(float){}
}

