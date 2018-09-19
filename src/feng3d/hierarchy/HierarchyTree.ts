namespace editor
{
    var nodeMap = new Map<feng3d.GameObject, HierarchyNode>();

    /**
     * 层级树
     */
    export var hierarchyTree: HierarchyTree;

    /**
     * 层级树
     */
    export class HierarchyTree
    {
        rootnode: HierarchyNode;

        private selectedGameObjects: feng3d.GameObject[] = [];

        constructor()
        {
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
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

        init(gameobject: feng3d.GameObject)
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

        delete(gameobject: feng3d.GameObject)
        {
            var node = nodeMap.get(gameobject);
            if (node)
            {
                node.destroy();
                nodeMap.delete(gameobject);
            }
        }

        add(gameobject: feng3d.GameObject)
        {
            if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node)
            {
                node.removeNode();
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode)
            {
                if (!node)
                {
                    node = new HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                parentnode.addNode(node);
            }
            gameobject.children.forEach(element =>
            {
                this.add(element);
            });
            return node;
        }

        remove(gameobject: feng3d.GameObject)
        {
            var node = nodeMap.get(gameobject);
            if (node)
            {
                node.removeNode();
            }
            gameobject.children.forEach(element =>
            {
                this.remove(element);
            });
        }

        /**
         * 获取节点
         */
        getNode(gameObject: feng3d.GameObject)
        {
            var node = nodeMap.get(gameObject);
            return node;
        }

        private onSelectedGameObjectChanged()
        {
            this.selectedGameObjects.forEach(element =>
            {
                var node = this.getNode(element);
                if (node)
                    node.selected = false;
                else
                    debugger; // 为什么为空，是否被允许？
            });
            this.selectedGameObjects = editorData.selectedGameObjects;
            this.selectedGameObjects.forEach(element =>
            {
                this.getNode(element).selected = true;
            });
        }
    }

    hierarchyTree = new HierarchyTree();

}

namespace feng3d
{
    export interface Feng3dEventMap
    {
        "editor.selectedObjectsChanged"
        "editor.isBaryCenterChanged"
        "editor.isWoldCoordinateChanged"
        "editor.toolTypeChanged"
        "editor.allLoaded"
    }
}