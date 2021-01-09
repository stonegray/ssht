// Compute hosts


import recursiveParser from './recursiveParser.js';
import computeHosts from './computeHosts.js';
import { translateHostFormat } from './translateHostFormat.js';

// Takes hosts with multiple names:
export default async function getHosts(){
    
    const hosts = await recursiveParser();

    const literalHosts = [];
    const globHosts = [];

    // takes exactly one host:
    const sortHost = (host) => {
        if (/[!*?]/.test(host.value)) {
            globHosts.push(host);

        } else {
            literalHosts.push(host);
        }
    };

    for (const host of hosts) {

        // Skip comments:
        if (host.type === 2) continue;
       
        // Sort wildcard hosts:
        if (host.param === "Host"){

            // value can be an array or a string, because we can have hosts
            // with multiple definitions with multiple types, eg:
            //      Host foo.example.com *.bar.example.com !baz.bar.example.com
    
            if (typeof host.value === 'string'){
                sortHost(host);
    
            } else if (Array.isArray(host.value)){

                // Process as discrete entries:
                for (const n of host.value){
                    sortHost({
                        ...host,
                        value: n,
                    });
                }

            } else {
                console.error("Unexpected value type:", host);
            }
    
        }
    }


    const computedHosts = computeHosts(literalHosts, globHosts);

    return translateHostFormat(computedHosts);

}

