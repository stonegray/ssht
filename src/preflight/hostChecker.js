

import options from '../core/options.js';

import FastSSH from './fastSsh.js';
import ICMPPEcho from './icmpEcho.js';
import checkInternet from './connectivity.js';


export default class HostChecker {
    constructor(){
        this.icmp = new ICMPPEcho();
        this.fastSSH = new FastSSH();
    }

    queueCheck(host, callback){

        // All hosts will show as ineligable for preflight host checking if
        // this option is truthy.
        if (options.noPreflight){

            callback({
                state: "INELIGABLE"
            });

            return;
        }



    }

    async _check(host){
        host;
    }


}
/*
icmp.queueICMPEcho({
    fqdn: '127.0.0.1'
}, data =>{
    console.log(data)
})
icmp.queueICMPEcho({
    fqdn: '1.1.1.1'
}, data =>{
    console.log(data)
});
icmp.queueICMPEcho({
    fqdn: 'stonegray.ca'
}, data =>{
    console.log(data)
});
icmp.queueICMPEcho({
    fqdn: 'google.ca'
}, data =>{
    console.log(data)
});
icmp.queueICMPEcho({
    fqdn: 'mdns.local'
}, data =>{
    console.log(data)
});
*/