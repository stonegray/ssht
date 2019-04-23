// Request array of hosts from the ~/.ssh/hosts file

import { Docker } from "node-docker-api";

let docker = new Docker({ socketPath: "/var/run/docker.sock" });

interface DSHost {
    name: string; // Human readable name
    fqdn: string;
    username?: string;
    port?: number;
    isUp?: boolean;
    kind?: string;
    family?: string;
    bindAddress?: string;
    bindInterface?: string;
}

// Check if the werid port structure has an SSH open:
function portHasSSH(net): boolean {
    // Assume we don't have a valid port.
    let found: boolean = false;

    // Check them all and set the flag.
    net.Ports.forEach(p => {
        if (!!(p.PrivatePort == 22) && p.Type == "tcp") {
            found = true;
        }
    });

    // return boolean
    return found;
}

// Array of hosts to return when file read is complete.
const dshosts: Array<DSHost> = [];

function _getHosts(callback: Function): void {
    // List
    docker.container.list().then(containers => {
        // get container info
        containers.forEach(container => {
            const d = container.data;

            const ns = d.NetworkSettings.Networks;

            const name: string = d.Names[0];

            // If SSH isn't open, ignore the host:
            if (portHasSSH(d)) {
                // For each network:
                Object.keys(ns).forEach(function(item) {
                    //console.log(item); // key
                    if (typeof ns[item].IPAddress == "string") {
                        // Looks good:

                        dshosts.push({
                            name: name,
                            fqdn: ns[item].IPAddress
                        });
                    }
                });
            } else {
                console.warn(`WARN: ${name} does not use SSH, skipping.`);
            }
        });

        callback(false, dshosts);
    });
}

// Thanks, i hate it.
export const getDockerHosts = async function() {
    return await new Promise((resolve, reject) => {
        _getHosts((err, obj) => {
            if (err) reject(err);
            resolve(obj);
        });
    });
};
