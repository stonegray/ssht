import { EventEmitter } from 'events';
import os from 'os';

import { spawn, Worker } from "threads";

import options from '../core/options.js';

import worker from './worker.js';

export default class Searcher extends EventEmitter {
	constructor() {
		super();

		this.workers = [];

		// The modulo of the hostCount is used to evenly distrobute hosts
		// across workers in the pool:
		this.hostCount = 0;


		// Unless specified, we default to using the same number of threads
		// as there are CPUs.
		this.numWorkers = options.threads || os.cpus().length;

		// Cache searches and hosts until the engine is initialized:
		this.hostCache = [];
		this.queryCache = '';
      
		// Delibrate non-await invocation of an async function, this can
		// finish whenever.
		this.initialize();

		// Set when workers are running, until this is true all incoming quereis
		// and hosts will be cached.
		this.ready = false;
	}

	// We need to wait for some async stuff to happen during startup,
	// so we can't do it in the constructor.
	async initialize(){

		for (let i = 0; i < this.numWorkers; i++) {

			// Create a new worker
			const w = await spawn(new Worker("./worker.js"));

			this.workers.push(w);
		}

		this.ready = true;

		// Flush the cache of hosts into the workers:
		this.hostCache.map(this.addHost.bind(this));
		this.query(this.queryCache);

	}

	addHost(host){

		// If we don't have the workers ready, just cache the hosts here for now.
		// Once they are ready, we will redistobute them.
		if (!(this.ready)){
			this.hostCache.push(host);
			return;
		}

		// Pick a worker:
		const target = this.hostCount % this.numWorkers;

		// eslint-disable-next-line security/detect-object-injection
		this.workers[target].addHost(host);

		this.hostCount++;
        
	}

	async query(query){


		if (!this.ready){
			this.queryCache = query;
			return [];
		}

		let result = [];

		for (const w of this.workers){
			result = [
				...result,
				...await w.query(query)
			];
		}

		//console.log(JSON.stringify(result));
		return result.map(i=>i.item);

	}
}