// test


import options from './core/options.js';
import checkInternet from './preflight/connectivity.js';
import FastSSH from './preflight/fastSsh.js';
import ICMPPEcho from './preflight/icmpEcho.js';
import { getPublicIp, getPrivateIp, getGatewayIp, getInterfaces, getActiveInterface } from './util/network.js';
import { getClientVersion } from './diags/sshClient.js';


export default async function diags() {
	console.log('Running diagnostics...');


	const ping = await new Promise(resolve =>{
		(new ICMPPEcho()).queueICMPEcho({fqdn: '1.1.1.1'}, resolve);
	});
	console.log('Internet:', await checkInternet());
	console.log('\tDNS ping:', ping.ping, 'ms');

	try {
		const activeIface = await getActiveInterface();
		console.log('\tDefault Interface:', activeIface.name, activeIface.ip_address, activeIface.netmask);
		console.log('\tRoute:', activeIface.gateway_ip);
	} catch {
		console.log('\tWARN: Unable to determine active interface');
	}
    
	const ifaceNames = (await getInterfaces()).map(iface => iface?.name);

	console.log('\tAvailable Ifaces:', ifaceNames);
    
	const ssh = await new Promise(resolve =>{
		(new FastSSH()).queueCheckHost({fqdn: 'saffron.stonegray.ca'}, resolve);
	});

	const okString = !ssh.error ? 'Connection OK' : 'Connection Failed';
	console.log('Builtin FastSSH:',`${okString} (${ssh.handshakeTime}ms handshake)`);


	console.log('Default system SSH client:', await getClientVersion());

	return;

	console.log('Netowkr:', await getPublicIp());
	console.log('Netowkr:', await getPrivateIp());
	console.log('Netowkr:', await getGatewayIp());
	console.log('Netowkr:', await getInterfaces());
	console.log('Netowkr:', await getActiveInterface());

    
}