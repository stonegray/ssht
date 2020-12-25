import { EventEmitter } from 'events';


export default class Searcher extends EventEmitter {
    constructor(pool) {
        super();

        this.searchJob = null;
    }

    query(query){


    }
}