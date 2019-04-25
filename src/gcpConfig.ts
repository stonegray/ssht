// Request array of hosts from GCP

/* gcpConfig
 *
 * Make ssht aware of running GCP Compute instances by using the system's gcloud
 * utility.
 *
 * This requires that gcloud is configured, and a default project is set.
 *
 */

import { exec } from "child_process";

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
  ssh: string;
  // Extra:
  online?: boolean;
  comment?: string;
}

// Eventually this array is returned:
const dshosts: Array<DSHost> = [];

function pReturnString(command) {
  return new Promise((resolve, reject) => {
    exec(command, function(error, stdout, stderr) {
      if (error) reject(stderr);
      resolve(stdout);
    });
  });
}

async function checkGcloudReady() {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(); // clear current text
    process.stdout.write("ssht: checking gcp install \r");
    const cmd = "gcloud auth list --format=json";
    pReturnString(cmd)
      .then(data => {
        try {
          const s = JSON.parse(data);
          s.forEach(j => {
            if (j.status == "ACTIVE") {
              process.stdout.clearLine(); // clear current text
              process.stdout.write("ssht: connected " + j.account + "\r");

              resolve(j.account);
            }
          });
          resolve(false);
        } catch (e) {
          resolve(false);
        }
      })
      .catch(e => {
        resolve(false);
      });
  });
}

async function getGcloudHosts() {
  return new Promise((resolve, reject) => {
    const cmd = "gcloud compute instances list --format=json";
    process.stdout.clearLine(); // clear current text
    process.stdout.write("ssht: requesting instance list..." + "\r");
    pReturnString(cmd)
      .then(data => {
        try {
          const s = JSON.parse(data);
          process.stdout.clearLine(); // clear current text

          process.stdout.write("ssht: parsing server list..." + "\r");
          let ok = false;
          s.forEach(j => {
            const ip = j.networkInterfaces[0].accessConfigs[0].natIP;

            if (typeof ip === "string") {
              dshosts.push({
                name: j.name,
                fqdn: ip,
                kind: "gcp",
                ssh: ip
              });
              ok = true;
            }
          });

          resolve(ok);
        } catch (e) {
          resolve(false);
        }
      })
      .catch(e => {
        resolve(false);
      });
  });
}

// Export as async function
export const getGcpHosts = async function(sock?: string) {
  // Return promise of _getHosts

  // perform a locak check before we bothr calling the full command
  if (await checkGcloudReady()) {
    await getGcloudHosts();
  }

  return dshosts;
};
