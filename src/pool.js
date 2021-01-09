
import { EventEmitter } from 'events';

import Fuse from 'fuse.js';

import Searcher from './search/search.js';
import HostChecker from './preflight/hostChecker.js';
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

export default class Pool extends EventEmitter {
    constructor(){
		super();
        this.pool = [];

		this.engine = new Searcher();
	}


    updateHost(uuid){

    }
    addHost(host){
        this.pool.push(host);

		// Send it to it's worker:
		this.engine.addHost(host);

		this.emit('size', this.pool.length);
    }
    removeHost(host){

		this.emit('size', this.pool.length);

    }

	async search(string) {


		this.emit('results', []);

		if (string == "") {
			this.emit('results', this.pool); 
		}

		if (string.length == 0) return [];

		const result = await this.engine.query(string);

		//console.log('RESULT', result)

		this.emit('results', result);
		this.emit('resultSize', result.length);

		/*
		const options = {
			keys: ['name','username','fqdn','port','kind'],
			ignoreLocation: true,
			includeMatches: true,
			isCaseSensitive: false,
			tokenize: true,
		};
		const fuse = new Fuse(this.pool, options);
	
		const results = fuse.search(string);

		if (typeof results == 'undefined') return;

		*/
		

		//this.emit('results', results.map(i => i.item));

	}


}