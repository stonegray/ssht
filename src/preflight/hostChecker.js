

import FastSSH from './fastSSH.js'
import ICMPPEcho from './icmpEcho.js';


const icmp = new ICMPPEcho();
const fastSSH = new FastSSH();

export default class HostChecker {
    constructor(){

    }


}

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