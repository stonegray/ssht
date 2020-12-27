const definitions = []

definitions.push({
    name: 'verbose',
    default: false,
    type: 'boolean',
    alias: 'f',
    argument: '--verbose',
    fileId: 'main',
    fileField: 'verbose',
    allowEmpty: false,
    description: "Enable verbose logging",
    hidden: false,
    conflicts: [],
    group: undefined,
    validator: val => {
        return (!!val || !val); // dumb choice for an example
    }
});

definitions.push({
    name: 'foobar',
    default: false,
    type: 'boolean',
    alias: undefined,
    argument: '--noplugins',
    fileId: 'main',
    fileField: undefined,
    allowEmpty: false,
    description: "Disable plugin loading",
    hidden: false,
    conflicts: [],
    group: undefined,
    validator: val => {
        return (!!val || !val); // dumb choice for an example
    }
});

export default definitions;