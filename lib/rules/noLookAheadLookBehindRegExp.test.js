"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const noLookaheadLookbehindRegex_1 = require("./noLookaheadLookbehindRegex");
// Rule tester for when no browserslist is passed, so lookahead and lookbehind should not be allowed
const tester = new eslint_1.RuleTester({
    languageOptions: {
        parser: require("@typescript-eslint/parser"),
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});
const groups = [
    { expression: "?=", type: "lookahead" },
    { expression: "?<=", type: "lookbehind" },
    { expression: "?!", type: "negative lookahead" },
    { expression: "?<!", type: "negative lookbehind" },
];
tester.run("noLookaheadLookbehindRegexp", noLookaheadLookbehindRegex_1.noLookaheadLookbehindRegexp, {
    valid: [
        // dont flag string values when they are not used in combination with RegExp
        ...groups.map((g) => {
            return {
                name: `valid-${g.type}`,
                code: `var str = "(${g.expression}foo)"`,
            };
        }),
        // dont flag escaped sequences
        ...groups.map((g) => {
            return {
                name: `valid-escaped-${g.type}`,
                code: `/\\(${g.expression})/g`,
            };
        }),
    ],
    invalid: [
        // When initializing with a literal
        ...groups.map((g) => {
            return {
                code: `const regexp = /(${g.expression})/;`,
                errors: [
                    {
                        message: `Disallowed ${g.type} match group at position 0`,
                    },
                ],
            };
        }),
        // When passed as a component prop
        ...groups.map((g) => {
            return {
                code: `<Component prop={/(${g.expression})/}/>`,
                errors: [
                    {
                        message: `Disallowed ${g.type} match group at position 0`,
                    },
                ],
            };
        }),
        // Passed as string to RegExp constructor
        ...groups.map((g) => {
            return {
                code: `new RegExp("(${g.expression})")`,
                errors: [
                    {
                        message: `Disallowed ${g.type} match group at position 1`,
                    },
                ],
            };
        }),
        // Passed as literal to RegExp constructor
        ...groups.map((g) => {
            return {
                code: `new RegExp(/(${g.expression})/);`,
                errors: [
                    {
                        message: `Disallowed ${g.type} match group at position 1`,
                    },
                ],
            };
        }),
    ],
});
tester.run("Caniuse: noLookaheadLookbehindRegexp", noLookaheadLookbehindRegex_1.noLookaheadLookbehindRegexp, {
    valid: [
        // dont flag escaped sequences
        ...groups.map((g) => {
            return {
                code: `var str = "(${g.expression}foo)"`,
                settings: { browser: "Chrome 96, Firefox 96" },
            };
        }),
        ...groups.map((g) => `/\\(${g.expression})/g`),
    ],
    invalid: [
        {
            code: `const regexp = /(?<=foo)/;`,
            settings: {
                browsers: ["Safari 15"],
            },
            errors: [{ message: `Safari 15: unsupported lookbehind match group at position 0` }],
        },
        {
            code: `const regexp = /(?<=foo)/;`,
            settings: {
                browsers: ["Chrome 61"],
            },
            errors: [{ message: `Chrome 61: unsupported lookbehind match group at position 0` }],
        },
        {
            code: `const regexp = /(?<=foo)/;`,
            settings: {
                browsers: ["ie 11, safari 13"],
            },
            errors: [
                {
                    message: `Internet Explorer 11, Safari 13: unsupported lookbehind match group at position 0`,
                },
            ],
        },
    ],
});
