// ssht

import { getSshHosts } from "./sshConfig";
import { getDockerHosts } from "./dockerConfig";
import { getGcpHosts } from "./gcpConfig";

export const hosts = async () => {
  process.stdout.write("ssht: searching Docker hosts..." + "\r");
  let d = await getDockerHosts();

  process.stdout.write("ssht: searching SSH config file hosts..." + "\r");
  let f = await getSshHosts();

  process.stdout.write("ssht: searching Google Cloud Compute hosts..." + "\r");
  let g = await getGcpHosts();

  return f.concat(g).concat(d);
};
