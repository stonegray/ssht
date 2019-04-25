// ssht

import { getSshHosts } from "./sshConfig";
import { getDockerHosts } from "./dockerConfig";






export const hosts = async () => {
let f = await getSshHosts();
let g = await getDockerHosts();
return f.concat(g);
};
