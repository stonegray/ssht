/* Required values
     * - uuid (optional for now)
     * - name
     * - fqdn
     * - ssh command
     *

    // Unique identifier. This is used or maintinag the host database, and must
    // be unique. This is to allow updating information about the host.
    uudd?: string;

    // Human readable name of the host.
    name: string;

    // FQDN or IP of host.
    fqdn: string;

    // SSH Settings:
    username?: string;
    port?: number;
    family?: string;
    bindaddress?: string;
    bindinterface?: string;

    // SSH command to use when connecting.
    ssh: string;

    // Status information
    ping?: number;

    // Usually your plugin name, eg 'docker'
    kind?: string;

    // Additional human readable content
    comment?: string;*/
export function translateHostFormat(hosts) {
	return hosts.map(host => {

		// Build parameters array from SSHConfig object:
		const params = {};
		if (Array.isArray(host.config)) {
			for (const c of host.config) {

				// Strip comments for now:
				if (c.type !== 1)
					continue;

				// rewrite as lowercase:
				params[c.param.toLowerCase()] = c.value;
			}
		}

		// For clarity, I'm using explicit assignment to undefined as
		// it might be confusing otherwise.
		return {
			// Required parameters:
			name: host.value,
			fqdn: params.hostname || host.value,

			// Optional parameters:
			port: params.port || undefined,
			username: params.user || undefined,
			family: 4,
			kind: 'SSH',

			bindaddress: params.bindaddress || undefined,
			bindinterface: params.bindinterface || undefined,

			meta: {
				...host,
				...params
			}
		};

	});
}
