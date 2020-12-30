
const definitions = [];

definitions.push({
    name: 'sshClient',
    default: false,
    type: 'string',
    alias: '-c',
    argument: '--client',
    fileId: 'main',
    fileField: 'sshClient',
    allowEmpty: true,
    description: "Specify SSH client to use (defaults to first in $PATH)",
    hidden: false,
    conflicts: [],
    group: 'Advanced',
    validator: () => true
});

definitions.push({
    name: 'sshConfigFile',
    default: false,
    type: 'string',
    alias: '-F',
    argument: '--sshCfg',
    fileId: 'main',
    fileField: 'sshConfigFile',
    allowEmpty: true,
    description: "Specifies an alternative per-user configuration file to use   for the SSH config parser. Equvilalant to the -F option of    SSH, see man ssh_config(5)",
    hidden: false,
    conflicts: [],
    group: 'Advanced',
    validator: () => true
});
export default definitions;