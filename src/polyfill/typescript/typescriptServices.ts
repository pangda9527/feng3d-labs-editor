/// <reference path="../../../libs/typescriptServices.d.ts" />
namespace ts
{
    export declare function hasModifier(node: Node, flags: ModifierFlags): boolean;
    // export declare function getAllAccessorDeclarations(declarations: NodeArray<Declaration>, accessor: AccessorDeclaration): AllAccessorDeclarations;
    export declare function getAllAccessorDeclarations(declarations: NodeArray<Declaration>, accessor: AccessorDeclaration);
    export declare function getClassExtendsHeritageElement(node: ClassDeclaration | ClassExpression | InterfaceDeclaration): ExpressionWithTypeArguments | undefined
    export declare function getDeclarationOfKind<T extends Declaration>(symbol: Symbol, kind: T["kind"]): T | undefined
    export declare function getTextOfPropertyName(name: PropertyName): __String

    export interface Statement extends Node
    {
        transformFlags
    }

    export declare enum TransformFlags
    {
        ContainsDecorators
    }

    export interface VariableDeclaration extends NamedDeclaration
    {
        callerList?: string[];
        delayInitializerList?: Expression[];
    }

}