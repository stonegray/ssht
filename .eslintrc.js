module.exports = {
    plugins: [
        "prettier",
        "filenames",
        "security",
        //"fp",
        "node",
        "promise"
    ],
    extends: [
        "plugin:security/recommended",
        "plugin:node/recommended",
        "eslint:recommended"
    ],
    env: {
        es6: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2015
    },
    rules: {
        // Plugin rules for clidnc:

        "security/detect-non-literal-fs-filename": 0,

        "node/no-missing-import": 2,
        "node/no-extraneous-import": 2,
        "node/no-unpublished-require": 0,
        "node/no-deprecated-api": 0,

        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "promise/avoid-new": "off",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "warn",
        "promise/valid-params": "warn",
        "filenames/match-regex": [
            2,
            "^([a-z0-9]+)([A-Z][a-z0-9]+)*(.(test|settings))?$",
            true
        ],

        indent: ["error", "tab"],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "always"],

        "comma-dangle": [
            "error",
            {
                arrays: "only-multiline",
                objects: "only-multiline",
                imports: "only-multiline",
                exports: "always",
                functions: "never"
            }
        ],

        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-invalid-regexp": "error",

        // Add in some I've used before:
        "no-empty": "warn", // Empty blocks; probably not indended.
        "no-func-assign": "error", // Reassigning functions explicitly declared; probably not indended.

        "no-extra-boolean-cast": "warn", // I use this reasonably often for converting anything to a bool but it's not really readable and clear so lets stop doing that. (eg. !!val)
        "no-inner-declarations": "warn", // Bad idea
        "no-extra-semi": "warn", // I'm sorta ok with this
        "no-irregular-whitespace": "error", // Prevents weird whitespace in files

        "no-negated-in-lhs": "warn", // This wasn't my idea but not a bad practice.

        "use-isnan": "error", // Force isNaN();
        "valid-typeof": "error", // Force typeof comps to valid values

        "accessor-pairs": 2, // Probalby won't need this. We don't use getter/ssetters yet
        "block-scoped-var": 2, // Bad scope like in C
        curly: ["error", "multi-line"], // Force curlies on multi-line blocks.
        "default-case": 2, // Require default case in switch blocks
        "dot-location": [2, "property"], // Force dot on property side of multi-line objects
        "dot-notation": 2, // Force dot notation.
        eqeqeq: [2, "smart"], // Use === instead of ==
        "no-alert": 1, // We don't even have alert.
        "no-caller": 1, //This is depricated and causes issues with optimization.

        "no-case-declarations": 2, // Don't allow declaration in switch/case.
        "no-div-regex": 1, // Formatting, prevents regexes that look like division.
        "no-else-return": 1,
        "no-eval": 2, // This is usually bad.
        "no-extend-native": 2, // Sorta goes without saying that this is bad too.
        "no-extra-bind": 2,
        "no-fallthrough": 2, // switch/case fallthough prevention
        "no-floating-decimal": 1, // no floating decimal like -.3 or .4

        // Formatting:
        // I think this ruleset was back from the backup tool, I just copied it from the one I had in the DNC app.
        "space-before-function-paren": ["error", "never"],
        "array-bracket-spacing": [2, "never"], // let arr = [3,5,3,'foo','bax']
        "block-spacing": [2, "never"], // no spacing in {};
        "brace-style": [2, "1tbs", { allowSingleLine: false }],
        camelcase: [2, { properties: "always" }],
        "comma-spacing": [2, { before: false, after: true }],
        "comma-style": [2, "last"],
        "computed-property-spacing": [2, "always"], // doesn't matter we don't use em
        "consistent-this": [2, "self"], // doesn't matter turned off
        "eol-last": 2, // \n at eof
        "func-style": ["error", "declaration", { allowArrowFunctions: true }],
        indent: ["error", "tab"],
        "key-spacing": [
            2,
            { beforeColon: false, afterColon: true, align: "value" }
        ],
        "new-cap": 2,
        "new-parens": 2,
        "no-array-constructor": 2,
        "no-bitwise": 1, // Feel free to bypass this one
        "no-lonely-if": 1, // Changed for clidnc
        "no-mixed-spaces-and-tabs": 2,
        "no-multiple-empty-lines": [1, { max: 8, maxEOF: 3 }],
        "no-nested-ternary": 2,
        "no-new-object": 2,
        "no-spaced-func": 2,
        "no-trailing-spaces": [2, { skipBlankLines: true }],
        "no-unneeded-ternary": 2,
        "object-curly-spacing": [2, "always"],
        "operator-linebreak": [2, "none"],
        "quote-props": [2, "always"],
        quotes: ["error", "single", { allowTemplateLiterals: true }],
        semi: [2, "always"],
        "space-in-parens": [2, "never"],
        "space-infix-ops": 2,
        "space-unary-ops": [2, { words: true, nonwords: false }],
        "spaced-comment": [2, "always"],
        "arrow-parens": [2, "as-needed"], // Changed for clidnc.
        "arrow-spacing": 2,
        "constructor-super": 2,
        "generator-star-spacing": [2, { before: true, after: false }],
        "no-class-assign": 2,
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-this-before-super": 2,
        "no-var": 2,
        "prefer-arrow-callback": 1,
        "prefer-spread": 1,
        "prefer-template": 1,
        "require-yield": 2,

        // Added for this project:
        "no-console": 1 // We're a CLI, this is useful and easier than writing to stdout.
    }
};
