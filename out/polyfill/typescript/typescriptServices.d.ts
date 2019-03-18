/// <reference path="../../../libs/typescriptServices.d.ts" />
declare namespace ts {
    function hasModifier(node: Node, flags: ModifierFlags): boolean;
    function getAllAccessorDeclarations(declarations: NodeArray<Declaration>, accessor: AccessorDeclaration): any;
    function getClassExtendsHeritageElement(node: ClassDeclaration | ClassExpression | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    function getDeclarationOfKind<T extends Declaration>(symbol: Symbol, kind: T["kind"]): T | undefined;
    function getTextOfPropertyName(name: PropertyName): __String;
    interface Statement extends Node {
        transformFlags: any;
    }
    enum TransformFlags {
        ContainsDecorators
    }
    interface VariableDeclaration extends NamedDeclaration {
        callerList?: string[];
        delayInitializerList?: Expression[];
    }
    function getClassExtendsHeritageElement(node: ClassDeclaration | ClassExpression | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    function getHeritageClause(clauses: NodeArray<HeritageClause> | undefined, kind: SyntaxKind): HeritageClause | undefined;
}
//# sourceMappingURL=typescriptServices.d.ts.map