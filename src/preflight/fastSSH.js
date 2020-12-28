
import net from 'net';

import readPkg from 'read-pkg';

import { asyncSleep, hrtimeToMs } from '../util/time.js';

// Get package info for building clientIdentifier
const pkg = await readPkg();

// We should use something human readable for a comment, since sysadmins might
// be curious why there's a host opening and not completing a handshake if
// they are looking at logs.
const sshComment = "SSHT PREFLIGHT HOST CHECKER HTTPS://GITHUB.COM/STONEGRAY/SSHT";

// ClientIdentifier docs:
// RFC 4253 4.2
// https://tools.ietf.org/html/rfc4253#section-4.2
const clientIdentifier = `SSH-2.0-${pkg.name}_${pkg.version} ${sshComment}\r\n`

// TODO: Move these into an options file:
const maxConnections = 1;
const tcpTimeout = 512;
const maxQueueSlowdown = 1000;

function parseSSHHeader(header){

    if (typeof header !== 'string'){
        console.warn("Unexpected header type", typeof header, header);
    }
    
    // I originally used a regex for this, but it's not the best way:
    /^(?:SSH-2.0-)(\S*)(?: (.*))$/;
    // I'll leave it documented here:
    // The protocol/prot version are uncaptured.
    // Capture group 1: "softwareversion" string
    // Capture group 2: "comment" string, optional

    // TODO: We shouldn't hardcode the version here, although i think
    // for our purposes it's ok for now:
    if (!header.startsWith('SSH-2.0')){
        return false;
    }

    // Check for an invalid header
    // TODO: We should abort the stream if we get a big header, to avoid
    // hanging if we hit a server that streams a ton of data.
    if (header.length > 255){
        return false;
    }

    // Remove header since it's fixed length:
    let arr = header.slice(8).trim().split(' ');
    // [0] contains the softwareVersion;
    // [1] contains the comment

    return {
        version: arr[0],
        comment: arr[1] || ''
    }
}

// Quickly perform the first bytes of an SSH handshake to check that server is
// online. Exponentially faster than actually doing a handshake because we
// close the connection before kx. 
export default class FastSSH {
    constructor(){

        this.connectionCount = 0;

        this.queuedChecks = [];
    }

    queueCheckHost(host, callback){

        // Temporary fix for overfull queue:
        if (this.connectionCount > 3 * maxConnections){
            console.warn("WARN: FastSSH connection queue is too long, skipping hosts:");
            callback({
                header: false,
                handshakeTime: 0,
                error: "FastSSH queue is full, try again later"
            })
            return;
        }
        
        // If we have too many running, queue it:
        if (this.connectionCount > maxConnections){

            // TODO: We should throw some sort of warning if expected time to
            // clear the queue exceeds a certain time. Just compute checks/sec
            // and pick a threshold like 2000ms
            this.queuedChecks.push({
                host: host,
                callback: callback
            });

        } else {

            // Execute the request immediately if we can:
            this._checkHost(host, callback);

        }

    }

    async _checkHost(host, callback){

        const defaultFailResult = {
            header: false,
            handshakeTime: 0,
            error: "Malformed host"
        }

        if (typeof host.fqdn !== 'string'){
            callback(defaultFailResult);
            console.warn(host);
            return;
        }

        // Increment connection counter:
        this.connectionCount++;

        const hostStatus = await new Promise(resolve =>{
            const socket = new net.Socket();
            let startTime;

            const timeout = setTimeout(()=>{
                socket.destroy();
                resolve({
                    header: false,
                    handshakeTime: tcpTimeout,
                    error: 'Timeout'
                })
            }, tcpTimeout);

            socket.on('data', function (data) {
                const time = process.hrtime(startTime);
                //console.log(hrtimeToMs(time), 'Received: ' + data);
                clearTimeout(timeout);
                socket.destroy();
                resolve({
                    header: parseSSHHeader(String(data)),
                    handshakeTime: hrtimeToMs(time),
                    error: false
                })
            });

            socket.on('error', function (err) {
                const time = process.hrtime(startTime);
                socket.destroy();
                clearTimeout(timeout);
                resolve({
                    header: false,
                    handshakeTime: hrtimeToMs(time),
                    error: err
                })
            });

            const port = host.port || 22;

            socket.connect(port, host.fqdn, function () {
                socket.write(clientIdentifier);
                startTime = process.hrtime();
            });
        })

        // when the promise resolves, the socket is destroyed so we can allow
        // others to run:

        this.connectionCount--;

        callback(hostStatus);

        // Optional slowdown once we hit the max queue size:

        // If there are queued checks, run those:
        if (this.queuedChecks.length > 0) {
            const next = this.queuedChecks.pop();

            await asyncSleep(maxQueueSlowdown);
            await this._checkHost(next.host, next.callback);
        }
    }
}





