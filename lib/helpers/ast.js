"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegExpLiteral = isRegExpLiteral;
exports.isStringLiteralRegExp = isStringLiteralRegExp;
function isRegExpLiteral(literal) {
    return "regex" in literal;
}
function isStringLiteralRegExp(literal) {
    return (literal.parent !== null &&
        literal.parent.type === "NewExpression" &&
        literal.parent.callee.type === "Identifier" &&
        literal.parent.callee.name === "RegExp");
}
