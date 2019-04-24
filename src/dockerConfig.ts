// Request array of hosts from docker

/* dockerConfig
 *
 * Make ssht aware of running Docker containers that have an open port
 * on 22/TCP
 *
 * There is a test container in ./test/container, which already has SSH enabled
 * for testing.
 */

import { Docker } from "node-docker-api";

interface DSHost {
    name: string; // Human readable name
    fqdn: string;
    username?: string;
    port?: number;
    isUp?: boolean;
    kind?: string;
    family?: string;
    ssh: string;
    bindAddress?: string;
    bindInterface?: string;
}

// Check if the contner port object describes SSH
function portHasSSH(net): boolean {
    // Check data object for a port entry that matches SSH

    // Assume we don't have a valid port.
    let found: boolean = false;

    // Check them all and set the flag if we find one
    net.Ports.forEach(p => {
        if (!!(p.PrivatePort == 22) && p.Type == "tcp") {
            found = true;
        }
    });

    // return boolean
    return found;
}

// Array of hosts to return when file read is complete.

function _getHosts(callback: Function, sock: string): void {
    // Get available hosts from Docker

    // Eventually this array is returned:
    const dshosts: Array<DSHost> = [];

    // Open a new connection to the docker socket:
    const docker = new Docker({
        socketPath: sock
    });

    // List
    docker.container
        .list()
        .then(containers => {
            // get container info
            containers.forEach(container => {
                // Preserve sanity by shortenign names
                const d: any = container.data;
                const ns: any = d.NetworkSettings.Networks;
                const name: string = d.Names[0];

                // If SSH isn't open, ignore the host:
                if (portHasSSH(d)) {
                    // For each network:
                    Object.keys(ns).forEach(function(item) {
                        //console.log(item); // key
                        if (typeof ns[item].IPAddress == "string") {
                            // Looks good:

                            dshosts.push({
                                name: name.substr(1),
                                fqdn: ns[item].IPAddress,
                                family: "ipv4",
                                port: 22,
                                ssh: "root@" + ns[item].IPAddress,
                                kind: "docker"
                            });
                        }
                    });
                } else {
                    console.warn(
                        `WARN: ${name} does not use SSH, skipping this Docker container.`
                    );
                }
            });

            callback(false, dshosts);
        })
        .catch(e => {
            callback(e, undefined);
        });
}

// Export as async function
export const getDockerHosts = async function(sock?: string) {
    // Return promise of _getHosts

    // Use default docker socket if none is supplied:
    if (typeof sock === "undefined") {
        sock = "/var/run/docker.sock";
    }

    return await new Promise((resolve, reject) => {
        _getHosts((err, obj) => {
            if (err) reject(err);
            resolve(obj);
        }, sock);
    });
};
