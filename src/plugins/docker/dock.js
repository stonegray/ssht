

import getContainers from './getContainers.js';

const sock = '/var/run/docker.sock'

const containers = await getContainers({
    socketPath: sock
});


if (containers.err?.statusCode === 500) ; //retry?

for (const c of containers.containers){
    console.log(c.Ports, c.HostConfig, c.NetworkSettings);
}
