
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

export default definitions;