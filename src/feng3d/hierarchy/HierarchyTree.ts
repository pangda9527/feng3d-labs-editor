namespace feng3d.editor
{
    var nodeMap = new Map<GameObject, HierarchyNode>();

    /**
     * 层级树
     */
    export var hierarchyTree: HierarchyTree;

    /**
     * 层级树
     */
    export class HierarchyTree extends Tree
    {
        rootnode: HierarchyNode;

        private selectedGameObjects: GameObject[] = [];

        constructor()
        {
            super();

            watcher.watch(editorData, "selectedObjects", this.onSelectedGameObjectChanged, this);
        }

        /**
         * 获取选中节点
         */
        getSelectedNode()
        {
            for (let i = 0; i < editorData.selectedGameObjects.length; i++)
            {
                var node = this.getNode(editorData.selectedGameObjects[i]);
                if (node)
                    return node;
            }
            return null;
        }

        init(gameobject: GameObject)
        {
            if (this.rootnode)
                this.rootnode.destroy();

            nodeMap.clear();

            var node = new HierarchyNode({ gameobject: gameobject });
            nodeMap.set(gameobject, node);
            node.isOpen = true;

            this.rootnode = node;
            gameobject.children.forEach(element =>
            {
                this.add(element);
            });
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
                    node = new HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                this.addNode(node, parentnode);
            }
            gameobject.children.forEach(element =>
            {
                this.add(element);
            });
            return node;
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

        private onSelectedGameObjectChanged()
        {
            this.selectedGameObjects.forEach(element =>
            {
                //清除选中效果
                var wireframeComponent = element.getComponent(WireframeComponent);
                if (wireframeComponent)
                    element.removeComponent(wireframeComponent);
                this.getNode(element).selected = false;
            });
            this.selectedGameObjects = editorData.selectedGameObjects;
            this.selectedGameObjects.forEach(element =>
            {
                //新增选中效果
                var wireframeComponent = element.getComponent(WireframeComponent);
                if (!wireframeComponent)
                    element.addComponent(WireframeComponent);
                this.getNode(element).selected = true;
            });
        }
    }

    hierarchyTree = new HierarchyTree();
}