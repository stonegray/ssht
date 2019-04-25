// Request array of hosts from the ~/.ssh/hosts file

import { parse as sshConfigParser } from 'ssh-config';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

os;

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

interface DSHost {
    name: string; // Human readable name
    fqdn: string;
    username?: string;
    port?: number;
    isUp?: boolean;
    kind?: string;
    family?: string;
    ssh: string;
    bindAddress?: string;
    bindInterface?: string;
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

// Array of hosts to return when file read is complete.
const dshosts: Array<DSHost> = [];

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

// The Callback Way:
function _getHosts(callback) {
	getFile((err, buf) => {
		// Parse file

		// If we have an error at this stage, it's from the getFile(), so let's
		// throw it and get it over with.
		if (err) {
			callback(err, undefined);
			return;
		}

		// Expect this to get an array of config entries. These are parsed in an
		// ugly way, so we'll pull this array apart and create an iterable object.
		let cfg: Array<SSHConfig>;

		cfg = sshConfigParser(buf);
		const hosts = [];

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
			dshosts.push({
				name: o.value,
				fqdn: info.fqdn,
				username: info.user,
				port: info.port,
				kind: 'sshconfig',
				ssh: sshCommand,
				family: info.family
			});
		});

		callback(false, dshosts);
	});
}

// Thanks, i hate it.
export const getSshHosts = async function() {
	return await new Promise((resolve, reject) => {
		_getHosts((err, obj) => {
			if (err) reject(err);
			resolve(obj);
		});
	});
};
