import readPkg from 'read-pkg';

import DiscoveryPlugin from '../../src/discovery/prototype.js';


// async equvillant of a setTimeout callback:
export async function asyncSleep(millis){
    return new Promise(resolve =>{
        setTimeout(resolve, millis);
    });
}

// Hang import for 2s:
await asyncSleep(2000);

export default class SlowLoadingPlugin extends DiscoveryPlugin {
    constructor(){
        super();

        this.name = "Foo";
        this.description = "Example builtin plugin that does nothing.";

    }
    start(){
    }
    stop(){
    }
    async meta() { return await readPkg(); }
}