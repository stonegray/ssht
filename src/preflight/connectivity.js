
import ICMPPEcho from "./icmpEcho.js"


const hosts = [
    '1.1.1.1',
    '8.8.8.8',
    'he.net',
];

const pinger = new ICMPPEcho();

async function ping(host){
    return new Promise(res =>{
        pinger.queueICMPEcho({
            fqdn: host
        }, resolve);
    })
}

export default async function checkInternet(){

    let online = 0;
    
    let avgTime = null;

    for (const host of hosts){
        let p = await ping(host);

        if (avgTime == null) {
            ;
        }
    }




}