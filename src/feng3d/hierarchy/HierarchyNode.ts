namespace feng3d.editor
{
    export class HierarchyNode extends TreeNode
    {
        object3D: GameObject;

        /** 
         * 父节点
         */
        parent: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[] = [];

        constructor(object3D: GameObject)
        {
            super();
            this.object3D = object3D;
            this.label = object3D.name;
        }

        addNode(node: HierarchyNode)
        {
            super.addNode(node);
            this.object3D.addChild(node.object3D);
        }

        removeNode(node: HierarchyNode)
        {
            super.removeNode(node);
            this.object3D.removeChild(node.object3D);
        }
    }
}