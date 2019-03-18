/// <reference path="../../../libs/typescriptServices.d.ts" />
var ts;
(function (ts) {
    if (!ts.getClassExtendsHeritageElement) {
        ts.getClassExtendsHeritageElement = function (node) {
            var heritageClause = ts.getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
            return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
        };
    }
})(ts || (ts = {}));
//# sourceMappingURL=typescriptServices.js.map