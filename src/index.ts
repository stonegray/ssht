// asdf
//
import { getHosts } from "./sshConfig";
(async () => {
    let f = await getHosts();

    console.log(f);
})();
