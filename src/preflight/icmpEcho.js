
import raw from 'raw-socket';

import options from '../core/options.js';
import { hrtimeToMs } from '../util/time.js';

import resolve4 from './dns.js';
import { createHeader, parseResponse } from './icmpHelpers.js';

const pingTimeout = options.icmpTimeout || 1000;

const maxConnections = 64;

export default class ICMPPEcho {
	constructor(){
        
		this.runningCount = 0;

		this.queue = [];

	}

	queueICMPEcho(host, callback){

		// Temporary fix for overfull queue:
		if (this.connectionCount > 10 * maxConnections){
			console.warn("WARN: ICMPEcho connection queue is too long, skipping hosts:");
			callback({
				header: false,
				handshakeTime: 0,
				error: "ICMPEcho queue is full, goodbye"
			});
			return;
		}
        
		// If we have too many running, queue it:
		if (this.connectionCount > maxConnections){

			// TODO: We should throw some sort of warning if expected time to
			// clear the queue exceeds a certain time. Just compute checks/sec
			// and pick a threshold like 2000ms
			this.queuedChecks.push({
				host: host,
				callback: callback
			});

		} else {

			// Execute the request immediately if we can:
			this._pingHost(host, callback);

		}

	}


	async _pingHost(host, callback){

		// https://youtu.be/QS1-K01mdXs?t=30
		const socket = raw.createSocket({
			protocol: raw.Protocol.ICMP
		});

		const ip = await resolve4(host.fqdn);

		if (ip === null){
			callback({
				buffer: null,
				error: "Failed to resolve IP address",
				elapsed: 0
			});
			return;
		}

		const header = createHeader();

		const response = await new Promise(resolve => {

			let startTime;
			let timeout;

			// Ping time:
			let elapsed = 0;

			// eslint-disable-next-line no-unused-vars
			socket.send(header, 0, header.length, ip, (error, source) => {
				if (error) {
					resolve({
						buffer: null,
						error: error,
						elapsed: 0
					});
				}

				timeout = setTimeout(() => {
					resolve({
						buffer: null,
						error: 'Timeout',
						elapsed: pingTimeout
					});
					socket.close();
				}, 3000);

				startTime = process.hrtime();
			});

			socket.on('message', (buffer, source) => {
                
				// Discard anything we're not specifically looking for:
				if (source !== ip) return;
				clearTimeout(timeout);

				elapsed = hrtimeToMs(process.hrtime(startTime));

				resolve({
					buffer: buffer,
					elapsed: elapsed
				});

				socket.close();

				resolve();
			});

			socket.on('error', err => {
				clearTimeout(timeout);
				resolve({
					buffer: null,
					error: err,
					elapsed: 0
				});
			});

		});

		const out = parseResponse(response.buffer);

		callback({
			alive: false,
			error: response.error || null,
			ping: response.elapsed,
			host: host,
			ip: ip,
			...out // sets .alive, adds type/code
		});
	}

}

