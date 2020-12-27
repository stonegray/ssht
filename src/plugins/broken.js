/* eslint-disable */
import DiscoveryPlugin from '../discovery/prototype.js'

export default class BrokenPlugin extends DiscoveryPlugin {
    constructor(){
        super();
        this.bork = bork();

        
    }

    start(){
        this.bork();

        doesnosadfdafsdf;

        32 / 0;
    }
}