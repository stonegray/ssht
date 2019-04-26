// ssht

//import { getSshHosts } from './discover/ssh';
//import { getDockerHosts } from './discover/docker';
//import { getGcpHosts } from './discover/gcp';


export const hosts = async () => {
	process.stdout.write('ssht: searching Docker hosts...' + '\r');
	//let d = await getDockerHosts();

	process.stdout.write('ssht: searching SSH config file hosts...' + '\r');
	//let f = await getSshHosts();

	process.stdout.write('ssht: searching Google Cloud Compute hosts...' + '\r');
	//let g = await getGcpHosts();

	//@ts-ignore
	//return f.concat(g).concat(d);
};

