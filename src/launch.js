// Safely launch by 


import assert from 'assert/strict';

let main = null;

// Attempt to load everything:
try {
    main = await import('./main.js')
} catch(e) {

    switch (e.code) {
        case "ERR_DLOPEN_FAILED":
            console.log("Failed to load native libraries:");
            console.log(e.message)
            break;
    
        case "ERR_MODULE_NOT_FOUND":
            console.log("Failed to load builtin libraries");
            console.log(e.message)
            break;

        default:
            console.log("An unknown error occured while starting up:");
            console.log(e.message);
            console.log(e)
            break;
    }
    process.exit();
}

// Sanity checks before execution:
assert.equal(typeof main.default, "function");
assert.equal(main.default.constructor.name, "AsyncFunction");

await main.default();