import { TreeNode } from "../../ui/components/TreeNode";
export declare class HierarchyNode extends TreeNode {
    isOpen: boolean;
    /**
     * 游戏对象
     */
    gameobject: feng3d.GameObject;
    /**
     * 父结点
     */
    parent: HierarchyNode;
    /**
     * 子结点列表
     */
    children: HierarchyNode[];
    constructor(obj: gPartial<HierarchyNode>);
    /**
     * 销毁
     */
    destroy(): void;
    private update;
}
//# sourceMappingURL=HierarchyNode.d.ts.map