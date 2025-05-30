export type CheckableExpression = "lookahead" | "lookbehind" | "negative-lookahead" | "negative-lookbehind";
export type AnalyzeOptions = {
    rules: Partial<{
        [key in `no-${CheckableExpression}`]: 0 | 1;
    }>;
    config: Partial<{
        browserslist: boolean;
    }>;
};
type UnsupportedExpression = {
    type: "lookahead" | "lookbehind";
    negative?: 1;
    position: number;
};
declare function analyzeRegExpForLookaheadAndLookbehind(input: string, rules: AnalyzeOptions["rules"]): UnsupportedExpression[];
export { analyzeRegExpForLookaheadAndLookbehind };
//# sourceMappingURL=analyzeRegExpForLookaheadAndLookbehind.d.ts.map