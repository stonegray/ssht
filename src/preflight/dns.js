import dns from 'dns';
import net from 'net';

export default async function resolve4(fqdn) {
    return new Promise(resolve => {

        // Do we even need to resolve it?
        if (net.isIPv4(fqdn)) {
            return resolve(fqdn);
        }

        dns.resolve4(fqdn, (err, ips) => {

            // TODO: Better error handling:
            if (err) {
                //console.warn("WARN: Badly handled DNS resolution error, fix me please");
                resolve(null)
                return;
            }

            resolve(ips[0]);
        });
    })
}