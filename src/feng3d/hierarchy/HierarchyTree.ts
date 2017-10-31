module feng3d.editor
{
    export interface HierarchyNode extends TreeNode
    {
        gameobject: GameObject;
        /** 
         * 父节点
         */
        parent?: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
    }

    var nodeMap = new Map<GameObject, HierarchyNode>();

    export class HierarchyTree extends Tree
    {
        rootnode: HierarchyNode;

        init(gameobject: GameObject)
        {
            var hierarchyNode: HierarchyNode = { isOpen: true, gameobject: gameobject, label: gameobject.name, children: [] };
            nodeMap.push(gameobject, hierarchyNode);
            this.rootnode = hierarchyNode;
        }

        delete(gameobject: GameObject)
        {
            var node = nodeMap.get(gameobject);
            if (node)
            {
                this.destroy(node);
                nodeMap.delete(gameobject);
            }
        }

        add(gameobject: GameObject)
        {
            if (!gameobject.showinHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node)
            {
                this.removeNode(node);
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode)
            {
                if (!node)
                {
                    node = { isOpen: true, gameobject: gameobject, label: gameobject.name, children: [] };
                    nodeMap.push(gameobject, node);
                }
                this.addNode(node, parentnode);
            }
            gameobject.children.forEach(element =>
            {
                this.add(element);
            });
        }

        remove(gameobject: GameObject)
        {
            var node = nodeMap.get(gameobject);
            if (node)
            {
                this.removeNode(node);
            }
            gameobject.children.forEach(element =>
            {
                this.remove(element);
            });
        }

        /**
         * 获取节点
         */
        getNode(gameObject: GameObject)
        {
            var node = nodeMap.get(gameObject);
            return node;
        }
    }

    export var hierarchyTree = new HierarchyTree();
}