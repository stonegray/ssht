import { EventEmitter } from 'events';
import os from 'os';
import { spawn, Thread, Worker } from "threads"

export default class Searcher extends EventEmitter {
    constructor() {
        super();

        this.searchJob = null;

        this.workers = [];

        // The modulo of the hostCount is used to evenly distrobute hosts
        // across workers in the pool:
        this.numWorkers = 16;//os.cpus().length;
        this.hostCount = 0;


        // Cache searches and hosts until the engine is initialized:
        this.hostCache = [];
        this.queryCache = '';
      
        // Delibrate non-await invocation of an async function, this can
        // finish whenever.
        this.initialize();

        this.ready = false;
    }


    async initialize(initialize){
        console.log('starting...')

        for (let i = 0; i < this.numWorkers; i++) {

            this.workers.push(await spawn(new Worker("./worker.js")))
            
        }

        console.log('running x', this.workers.length)

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