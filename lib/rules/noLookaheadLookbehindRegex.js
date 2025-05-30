"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noLookaheadLookbehindRegexp = exports.getExpressionsToCheckFromConfiguration = exports.DEFAULT_CONF = exports.DEFAULT_OPTIONS = void 0;
const analyzeRegExpForLookaheadAndLookbehind_1 = require("../helpers/analyzeRegExpForLookaheadAndLookbehind");
const caniuse_1 = require("../helpers/caniuse");
const ast_1 = require("../helpers/ast");
const createReport_1 = require("../helpers/createReport");
exports.DEFAULT_OPTIONS = {
    "no-lookahead": 1,
    "no-lookbehind": 1,
    "no-negative-lookahead": 1,
    "no-negative-lookbehind": 1,
};
exports.DEFAULT_CONF = {
    browserslist: true,
};
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}
const getExpressionsToCheckFromConfiguration = (options) => {
    if (!options.length)
        return { rules: exports.DEFAULT_OPTIONS, config: exports.DEFAULT_CONF };
    let rules = options;
    let config = {};
    if (isPlainObject(options[options.length - 1])) {
        rules = options.slice(0, -1);
        config = options[options.length - 1];
    }
    const validOptions = rules.filter((option) => {
        if (typeof option !== "string")
            return false;
        return exports.DEFAULT_OPTIONS[option];
    });
    if (!validOptions.length) {
        return { rules: exports.DEFAULT_OPTIONS, config };
    }
    const expressions = validOptions.reduce((acc, opt) => {
        acc[opt] = 1;
        return acc;
    }, {
        "no-lookahead": 0,
        "no-lookbehind": 0,
        "no-negative-lookahead": 0,
        "no-negative-lookbehind": 0,
    });
    return {
        rules: expressions,
        config,
    };
};
exports.getExpressionsToCheckFromConfiguration = getExpressionsToCheckFromConfiguration;
const noLookaheadLookbehindRegexp = {
    meta: {
        docs: {
            description: "disallow the use of lookahead and lookbehind regular expressions if unsupported by browser",
            category: "Compatibility",
            recommended: true,
        },
        schema: {
            type: "array",
            items: [
                {
                    oneOf: [
                        {
                            type: "string",
                            enum: ["off", "warn", "error"],
                        },
                        {
                            type: "string",
                            enum: [
                                "no-lookahead",
                                "no-lookbehind",
                                "no-negative-lookahead",
                                "no-negative-lookbehind",
                            ],
                        },
                        {
                            type: "object",
                            properties: {
                                browserslist: {
                                    type: "boolean",
                                },
                            },
                            additionalProperties: false,
                        },
                    ],
                },
            ],
            minItems: 0,
            maxItems: 6,
        },
        type: "problem",
    },
    create(context) {
        const browsers = context.settings.browsers || context.settings.targets;
        const { targets, hasConfig } = (0, caniuse_1.collectBrowserTargets)(context.getFilename(), browsers);
        // Lookahead assertions are part of JavaScript's original regular expression support and are thus supported in all browsers.
        const unsupportedTargets = (0, caniuse_1.collectUnsupportedTargets)("js-regexp-lookbehind", targets);
        const { rules, config } = (0, exports.getExpressionsToCheckFromConfiguration)(context.options);
        // If there are no unsupported targets resolved from the browserlist config, then we can skip this rule
        if (!unsupportedTargets.length && hasConfig)
            return {};
        return {
            Literal(node) {
                if ((0, ast_1.isStringLiteralRegExp)(node) && typeof node.raw === "string") {
                    const unsupportedGroups = (0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(node.raw, rules // For string literals, we need to pass the raw value which includes escape characters.
                    );
                    if (unsupportedGroups.length > 0) {
                        (0, createReport_1.createContextReport)(node, context, unsupportedGroups, unsupportedTargets, config);
                    }
                }
                else if ((0, ast_1.isRegExpLiteral)(node)) {
                    const unsupportedGroups = (0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(node.regex.pattern, rules);
                    if (unsupportedGroups.length > 0) {
                        (0, createReport_1.createContextReport)(node, context, unsupportedGroups, unsupportedTargets, config);
                    }
                }
            },
        };
    },
};
exports.noLookaheadLookbehindRegexp = noLookaheadLookbehindRegexp;
