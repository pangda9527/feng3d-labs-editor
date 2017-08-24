declare namespace feng3d.editor {
    class HierarchyNode extends TreeNode {
        object3D: GameObject;
        /**
         * 父节点
         */
        parent: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
        constructor(object3D: GameObject);
        addNode(node: HierarchyNode): void;
        removeNode(node: HierarchyNode): void;
    }
}
