

import { getContainers, getNetworks, getInfo } from './getDockerInfo.js';

const sock = '/var/run/docker.sock'



console.log(config)

if (containers.err?.statusCode === 500) ; //retry?

/*
for (const c of containers.containers){
    console.log(c.Ports, c.HostConfig, c.NetworkSettings);
}

console.log(containers);
*/