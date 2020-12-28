

import FastSSH from './fastSSH.js'
import ICMPPEcho from './icmpEcho.js';



const icmp = new ICMPPEcho();
const fastSSH = new FastSSH();


icmp.queueICMPEcho({
    fqdn: '127.0.0.1'
}, data =>{
    console.log(data)
})
icmp.queueICMPEcho({
    fqdn: '127.0.0.1333'
}, data =>{
    console.log(data)
});;