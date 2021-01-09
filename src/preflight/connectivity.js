
import options from '../core/options.js';

import ICMPPEcho from "./icmpEcho.js";

const hosts = [
    '1.1.1.1',
    '8.8.8.8',
    'he.net',
];

const pinger = new ICMPPEcho();

async function ping(host){
    return new Promise(resolve =>{
        pinger.queueICMPEcho({
            fqdn: host
        }, resolve);
    });
}

export default async function checkInternet(){

    // If the connectivity check is disabled, assume we're online:
    if (options.noOnlineCheck){
        return true;
    }

    let online = 0;
    
    for (const host of hosts){
        let p = await ping(host);

        if (p.alive) online++;
    }

    // Return true of more than half of the hosts are OK.
    return (online > (0.5*hosts.length));

}
