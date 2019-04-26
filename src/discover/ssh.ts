// Request array of hosts from the ~/.ssh/hosts file


import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';

import { parse as sshConfigParser } from 'ssh-config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/* Type definitions for ssh-config */
enum SSHFieldType {
    Data = 1,
    UserComment = 2
}

interface SSHConfig {
    type: SSHFieldType;
    param: string;
    content?: string;
    separator: string;
    value: string;
    before: string;
    after: string;
    config?: SSHConfig;

    forEach?: Function;
}

interface HostInfo {
    port?: number;
    username?: string;
    shkc?: string;
    user?: string;
    family?: string;
    host?: string;
    fqdn?: string;
    bindAddress?: string;
    bindInterface?: string;
}


function getFile(callback: Function): void {
	// cet homezozc
	const homedir: string = require('os').homedir();
	let p = path.resolve(homedir, '.ssh/config');

	// read file
	fs.readFile(p, (err, buf) => {
		callback(err, buf.toString());
	});
}

function humanizeLocation(cfg: SSHConfig): string {
	return cfg.param;
}

function parseHostOptions(o: SSHConfig): HostInfo {
	// Now we break the config object apart. This whole array of named keys
	// thing is irritat
	const info: HostInfo = {};

	// Each host has an attached SSHConfig object. We need to rip it apart
	// so that we're not blindly iterating through a loop.
	if (typeof o.config === typeof []) {
		o.config.forEach(cf => {
			// If the object doesn't have a parameter, abort
			if (typeof cf.param !== 'string') return;

			// Convert to unified case:
			cf.param = cf.param.toLowerCase();

			// If we get an Include, warn:
			// It's not a priority to handle these at the moment.
			if (cf.param == 'include') {
				console.warn('WARN: Not following Include statement.');
			}

			// ProxyCommand should work fine, but when we check the host
			// it will appear offline.
			if (cf.param == 'proxycommand') {
				console.warn(
					'WARN: ProxyCommand is unsupported; host most may appear offline'
				);
			} else if (cf.param == 'proxyjump') {
				console.warn(
					'WARN: ProxyJump is unsupported; host most may appear offline'
				);
			}

			// I'm not aware of a more convienit way to do this so I'm
			// resorting to if(){}
			if (cf.param == 'stricthostkeychecking') info.shkc = cf.value;
			if (cf.param == 'hostname') info.host = cf.value;
			if (cf.param == 'user') info.user = cf.value;
			if (cf.param == 'port') info.port = cf.value;
			if (cf.param == 'addressfamily') info.family = cf.family;

			return;
		});
	} else {
		console.warn('WARN: Recieved otherwise valid object without any data.');
	}

	return info;
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
export class sshPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'sshPlugin';

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

		this._msg('Reading SSH config file...');

		getFile((err, buf) => {
			// Parse file

			// If we have an error at this stage, it's from the getFile(), so let's
			// throw it and get it over with.
			if (err) {
				this._msg('Reading SSH config file...');
				return;
			}

			// Expect this to get an array of config entries. These are parsed in an
			// ugly way, so we'll pull this array apart and create an iterable object.
			let cfg: Array<SSHConfig>;

			cfg = sshConfigParser(buf);

			// Put each detected host into the host database.
			cfg.forEach(o => {
				// Each host has multiple SSHConfig objects; parse them each

				// Skip Comments
				if (o.type == SSHFieldType.UserComment) return;
				if (o.param !== 'Host') return;

				// Ignore hosts that have a liteal *,!, or ?, since these are probably
				// groups not actual hosts we can access. Could implement something to
				// use these later
				if (/[!\*?]/.test(o.value)) return;

				// Convert the host options into something useful:
				const info: HostInfo = parseHostOptions(o);

				// It's possible and valid to have a config entry without a hostname. If
				// this is the case, use the name instead.
				if (typeof info.host !== 'string') {
					info.fqdn = o.value;
				} else {
					info.fqdn = info.host;
				}

				// Build ssh command:
				let sshCommand = o.value;

				if (typeof info.user !== 'undefined') {
					sshCommand = info.user + '@' + sshCommand;
				}

				// We should have something that works by here, let's push it into the
				// array of known devices.
				//
				//	this._msg('Found google.ca/afsdef');
				const host:DSHost = {
					name: o.value,
					fqdn: info.fqdn,
					username: info.user,
					port: info.port,
					kind: 'sshconfig',
					ssh: sshCommand,
					family: info.family
				};
				this.emit(DSPEvents.host, host);
			});

			// REading file failed, send message and end:
			this._msg('Failed to read ssh config file.');
		});

	}
}


