import dns from 'dns';
import net from 'net';

// import MulticastDns from 'multicast-dns';

/*
async function queryMdns(fqdn){
    return new Promise(resolve =>{

        const mdns = MulticastDns();

        mdns.query({
            questions: [{
                name: fqdn,
                type: 'A'
            }]
        })

        setTimeout(resolve, 4000, null);

        mdns.on('response', response => {

            // Check that the response is for us:
            if (response.answers[0]?.data !== fqdn) return;

            resolve(response);
            mdns.destroy()
        });
    })
}
*/

export default async function resolve4(fqdn) {
	return new Promise(resolve => {

		// Do we even need to resolve it?
		if (net.isIPv4(fqdn)) {
			return resolve(fqdn);
		}

		// Experimental mDNS:
		/*
        if (/.*\.local$/.test(fqdn)){
            const resp = await queryMdns(fqdn);
            resolve(resp.answers[0].data);
            return;
        }
        */

		dns.resolve4(fqdn, (err, ips) => {

			// TODO: Better error handling:
			if (err) {
				console.warn("WARN: Badly handled DNS resolution error, fix me please");
				resolve(null);
				return;
			}

			resolve(ips[0]);
		});
	});
}


