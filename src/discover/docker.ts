// Request array of hosts from docker

/* dockerConfig
 *
 * Make ssht aware of running Docker containers that have an open port
 * on 22/TCP
 *
 * There is a test container in ./test/container, which already has SSH enabled
 * for testing.
 */

import { Docker } from 'node-docker-api';
import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';


// Check if the contner port object describes SSH
function   portHasSSH(net): boolean {
	// Check data object for a port entry that matches SSH

	// Assume we don't have a valid port.
	let found: boolean = false;

	// Check them all and set the flag if we find one
	net.Ports.forEach(p => {
		if (!!(p.PrivatePort == 22) && p.Type == 'tcp') {
			found = true;
		}
	});

	// return boolean
	return found;
}

// Array of hosts to return when file read is complete.

function _getHosts(callback: Function, sock: string): void {
	// Get available hosts from Docker

	// Eventually this array is returned:
	const dshosts: Array<DSHost> = [];

	// Open a new connection to the docker socket:
	const docker = new Docker({
		socketPath: sock
	});

	// List
	docker.container
		.list()
		.then(containers => {
		// get container info
			containers.forEach(container => {
			// Preserve sanity by shortenign names
				const d: any = container.data;
				const ns: any = d.NetworkSettings.Networks;
				const name: string = d.Names[0];

				// If SSH isn't open, ignore the host:
				if (portHasSSH(d)) {
				// For each network:
					Object.keys(ns).forEach(function(item) {
					//console.log(item); // key
						if (typeof ns[item].IPAddress == 'string') {
						// Looks good:

							dshosts.push({
								name: name.substr(1),
								fqdn: ns[item].IPAddress,
								family: 'ipv4',
								port: 22,
								ssh: 'root@' + ns[item].IPAddress,
								kind: 'docker'
							});
						}
					});
				} else {
					console.warn(
						`WARN: ${name} does not use SSH, skipping this Docker container.`
					);
				}
			});

			callback(false, dshosts);
		})
		.catch(e => {
			callback(e, undefined);
		});
}

// Export as async function
export const getDockerHosts = async function(sock?: string) {
	// Return promise of _getHosts

};
// Your discovery plugin is implemented here
//
// EVENTS:
//
// emits: debug
//	Your plugin can emit any type. 
//
// emits: status
//	Your plugin can emit a DSPEvents.status message. String. This may be shown
//	to the user and can provide feedback. The UI is reponsible for rate
//	limiting, so the plugin may call this as many times as needed.
//
// emits: percentage
//	Your plugin can emit a DSPEvents.percentage message if it's progress is
//	known. This may be ignored by the UI.
//
// emits: error
//	Emitted on a fatal error. String. No other events are expected after this
//	event is emitted, and may be discarded by the pool or UI. 
//
// emits: host
//	Emitted when a new host is found.
//
//
// listens: stop
//	Optional to implement at this time. Instructs your discovery app to stop. 
//
// listens: start
//	Optional to implement at this time. Instructs your discovery app to start.
//
//
// returns: instance of self
export class dockerPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'dockerPlugin';

		// Bind events:
		this.on(DSPEvents.start, this._start.bind(this));
		// Return the name of the plugin.
	}

	// Emit status and debug messages. Status messages are limited to String,
	// however debug messages can contain anything. They will likely be
	// serialized before writing to a file. 
	private _msg(msg: string){
		this.emit(DSPEvents.status, msg);
	}
	_debug(msg: any){
		this.emit(DSPEvents.debug, msg);
	}i
	_percentage(msg: number){
		this.emit(DSPEvents.percentage, msg+0);
	}

	// This is the main function of your plugin.
	_start(debug){
		const msg = this._msg.bind(this);
		const emit = this.emit.bind(this);
		// write to UI:
		msg('Starting Docker plugin');

		let sock = undefined;
		// Use default docker socket if none is supplied:
		if (typeof sock === 'undefined') {
			sock = '/var/run/docker.sock';
		}

		_getHosts((err, obj) => {
			if (err) throw err;
			obj.forEach(h=>{
				msg('Found '+h.name);
				emit(DSPEvents.host, h);

			});
		}, sock);
		// Generate random hosts to add:
		setInterval(()=>{
		},1000);
	}
}



