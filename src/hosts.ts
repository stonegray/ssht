// ssht

import { getSshHosts } from "./sshConfig";
import { getDockerHosts } from "./dockerConfig";

(async () => {
    let f = await getSshHosts();
    let g = await getDockerHosts();

    const z = f.concat(g);

    console.log(z);
})();
