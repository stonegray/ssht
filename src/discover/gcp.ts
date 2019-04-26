// Request array of hosts from GCP

/* gcpConfig
 *
 * Make ssht aware of running GCP Compute instances by using the system's gcloud
 * utility.
 *
 * This requires that gcloud is configured, and a default project is set.
 *
 */

import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';
import { exec } from 'child_process';

// Eventually this array is returned:
const dshosts: Array<DSHost> = [];

function pReturnString(command) {
	return new Promise((resolve, reject) => {
		exec(command, function(error, stdout, stderr) {
			if (error) reject(stderr);
			resolve(stdout);
		});
	});
}

function checkGcloudReady(msg) {
	return new Promise((resolve, reject) => {
		msg('checking gcloud auth status');
		const cmd = 'gcloud auth list --format=json';
		pReturnString(cmd)
			.then(data => {
				try {
					//@ts-ignore
					const s = JSON.parse(data);
					s.forEach(j => {
						if (j.status == 'ACTIVE') {
							msg('authorization ok:  '+j.account);
							setTimeout(resolve, 1, j.account);
						}
					});
					resolve(false);
				} catch (e) {
					resolve(false);
				}
			})
			.catch(e => {
				resolve(false);
			});
	});
}

function getGcloudHosts(msg, callback) {
	return new Promise((resolve, reject) => {
		const cmd = 'gcloud compute instances list --format=json';
		msg('requesting instance list');
		pReturnString(cmd)
			.then(data => {
				try {
					//@ts-ignore
					const s = JSON.parse(data);

					msg('parsing server list');
					let ok = false;
					s.forEach(j => {
						const ip = j.networkInterfaces[0].accessConfigs[0].natIP;

						if (typeof ip === 'string') {
							callback({
								name: j.name,
								fqdn: ip,
								kind: 'gcp',
								ssh: ip
							});
							ok = true;
						}
					});
					msg('done');

					resolve(ok);
				} catch (e) {
					resolve(false);
				}
			})
			.catch(e => {
				msg('requesting instance list failed');
				resolve(false);
			});
	});
}





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
export class gcpPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'gcpPlugin';

		// Bind events:
		this.on(DSPEvents.start, this._start.bind(this));
		// Return the name of the plugin.
	}

	// Emit status and debug messages. Status messages are limited to String,
	// however debug messages can contain anything. They will likely be
	// serialized before writing to a file. 
	_msg(msg: string){
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
		msg('starting gcp plugin');
		
		checkGcloudReady(msg).then((ok)=>{
			getGcloudHosts(msg,(h)=>{
				msg('added host '+h.name);
				emit(DSPEvents.host,h);
			});
		}).catch(e=>{
			msg('exiting: '+e);
		});

	}
}


