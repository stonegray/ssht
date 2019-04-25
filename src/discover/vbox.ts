// Request array of hosts from VirtualBox

/* gcpConfig
 *
 * Make ssht aware of running GCP Compute instances by using the system's gcloud
 * utility.
 *
 * This requires that gcloud is configured, and a default project is set.
 *
 */


import * as virtualbox from 'virtualbox';

import { DSHost } from '../shared/interfaces';

// Eventually this array is returned:
const dshosts: Array<DSHost> = [];

// tester
(async()=>{
	// 
	virtualbox.list(function list_callback(machines, error) {

		if (error) throw error;  // Act on machines});
		console.log(machines);
	});
})();  

// Export as async function
export const getGcpHosts = async function(sock?: string) {
	// Return promise of _getHosts


	return dshosts;
};


