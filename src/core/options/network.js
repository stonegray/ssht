
const definitions = [];

// Plugin options
definitions.push({
    name: 'icmpTimeout',
    default: false,
    type: 'number',
    alias: '-I',
    argument: '--icmp-timeout',
    fileId: 'main',
    fileField: 'icmpTimeout',
    allowEmpty: true,
    description: "Manually set ICMP timeout for HostChecker. Use 0 or    leave blank to automatically determine timeout",
    hidden: false,
    conflicts: [],
    group: 'Network',
    validator: value => {
        return (value < 1e4) && value > -1;
    }
});

definitions.push({
    name: 'maxTCPConnections',
    default: false,
    type: 'number',
    argument: '--max-tcp-conn',
    fileId: 'main',
    fileField: 'maxTCPConnections',
    allowEmpty: true,
    description: "Limit maximum concurrent TCP connections used by       FastSSH when querying SSH server versions",
    hidden: false,
    conflicts: [],
    group: 'Network',
    validator: value => {
        return (value < 1000) && value > -1;
    }
});

definitions.push({
    name: 'TCPTimeout',
    default: false,
    type: 'number',
    argument: '--max-tcp-time',
    fileId: 'main',
    fileField: 'TCPTimeout',
    allowEmpty: true,
    description: "Manually set TCP timeout for FastSSH. Leaving this     blank or setting to 0 for automatic mode is strongly   recommended",
    hidden: false,
    conflicts: [],
    group: 'Network',
    validator: value => {
        return (value < 1000) && value > -1;
    }
});

definitions.push({
    name: 'noOnlineCheck',
    default: false,
    type: 'boolean',
    alias: '-O',
    argument: '--no-online-check',
    fileId: 'main',
    fileField: 'noOnlineCheck',
    allowEmpty: true,
    description: "Disable the internet check. This disables WAN search   priority optimizations and automatic selection of TCP  and ICMP timeouts",
    hidden: false,
    conflicts: [],
    group: 'Network',
    validator: value => {
        return (value < 1000) && value > -1;
    }
});

definitions.push({
    name: 'impolite',
    default: false,
    type: 'boolean',
    argument: '--impolite',
    fileId: 'main',
    fileField: 'impolite',
    allowEmpty: true,
    description: "Disable courtesy data in ICMP and TCP messages",
    hidden: false,
    conflicts: [],
    group: 'Network',
    validator: () => true
});

export default definitions;