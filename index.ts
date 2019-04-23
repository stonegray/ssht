// ssh tool

import { parse as sshConfigParser } from "ssh-config";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/* Type definitions for ssh-config */
enum SSHFieldType {
    Data = 1,
    UserComment = 2
}

interface SSHConfig {
    type: SSHFieldType;
    param: string;
    content?: string;
    separator: string;
    value: string;
    before: string;
    after: string;
    config?: SSHConfig;

    forEach?: Function;
}

interface DSHost {
    name: string; // Human readable name
    fqdn: string;
    port?: number;
    isUp?: boolean;
    kind?: string;
}

interface HostInfo {
    port: number;
    username: string;
    shkc: string;
    user: string;
    host: string;
    fqdn: string;
}

const dshosts: Array<DSHost> = [];

function getFile(callback: Function): void {
    // cet homezozc
    const homedir: string = require("os").homedir();
    let p = path.resolve(homedir, ".ssh/config");

    // read file
    fs.readFile(p, (err, buf) => {
        callback(buf.toString());
    });
}

function humanizeLocation(cfg: SSHConfig): string {
    return cfg.param;
}

getFile(buf => {
    // Expect this to get an array of config entries. These are parsed in an
    // ugly way, so we'll pull this array apart and create an iterable object.
    let cfg: Array<SSHConfig>;

    cfg = sshConfigParser(buf);
    const hosts = [];

    // Put each detected host into the host database.
    cfg.forEach(o => {
        // Skip Comments
        if (o.type == SSHFieldType.UserComment) return;
        if (o.param !== "Host") return;

        // Ignore hosts that have a liteal *,!, or ?, since these are probably
        // groups not actual hosts we can access. Could implement something to
        // use these later
        if (/[!\*?]/.test(o.value)) return;

        // Now we break the config object apart. This whole array of named keys
        // thing is irritat
        const info: HostInfo = {
            port: undefined,
            username: "",
            shkc: "",
            user: "",
            host: "",
            fqdn: ""
        };
        if (typeof o.config === typeof []) {
            o.config.forEach(cf => {
                // If the object doesn't have a parameter, abort
                if (typeof cf.param !== "string") return;

                // Convert to unified case:
                cf.param = cf.param.toLowerCase();

                if (cf.param == "stricthostkeychecking") {
                    info.shkc = cf.value;
                }
                if (cf.param == "hostname") {
                    info.host = cf.value;
                }
                if (cf.param == "user") {
                    info.user = cf.value;
                }
                if (cf.param == "port") {
                    info.port = cf.value;
                }
            });
        } else {
            console.warn("Recieved otherwise valid object without any data.");
        }

        // It's possible and valid to have a config entry without a hostname. If
        // this is the case, use the name instead.
        if (info.host == "") {
            info.fqdn = o.value;
        } else {
            info.fqdn = info.host;
        }

        dshosts.push({
            name: o.value,
            fqdn: info.fqdn,
            port: info.port,
            kind: "ssh"
        });
    });

    console.log(dshosts);
});
