// Shared interface definitions


// Typedef of a host, returned by a discovery plugin.
export interface DSHost {
	name: string; // human readable name
	fqdn: string;
	username?: string;
	port?: number;
	isup?: boolean;
	kind?: string;
	family?: string;
	ssh: string;
	bindaddress?: string;
	bindinterface?: string;
	// Extra:
	online?: boolean;
	comment?: string;
}

