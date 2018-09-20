namespace editor
{
    export var hierarchy: Hierarchy;

    export class Hierarchy
    {
        rootnode: HierarchyNode;

        @feng3d.watch("rootGameObjectChanged")
        rootGameObject: feng3d.GameObject;

        constructor()
        {
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
        }

        /**
         * 获取选中节点
         */
        getSelectedNode()
        {
            var node = editorData.selectedGameObjects.reduce((pv: HierarchyNode, cv) => { pv = pv || this.getNode(cv); return pv; }, null);
            return node;
        }

        /**
         * 获取节点
         */
        getNode(gameObject: feng3d.GameObject)
        {
            var node = nodeMap.get(gameObject);
            return node;
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

        addGameoObjectFromAsset(gameobject: feng3d.GameObject, parent?: feng3d.GameObject)
        {
            gameobject = feng3d.serialization.clone(gameobject);
            
            if (parent)
                parent.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            editorData.selectObject(gameobject);
        }

        private _selectedGameObjects: feng3d.GameObject[] = [];

        private rootGameObjectChanged(property, oldValue, newValue)
        {
            if (oldValue)
            {
                oldValue.off("added", this.ongameobjectadded, this);
                oldValue.off("removed", this.ongameobjectremoved, this);
            }
            if (newValue)
            {
                this.init(newValue);
                newValue.on("added", this.ongameobjectadded, this);
                newValue.on("removed", this.ongameobjectremoved, this);
            }
        }

        private onSelectedGameObjectChanged()
        {
            this._selectedGameObjects.forEach(element =>
            {
                var node = this.getNode(element);
                if (node)
                    node.selected = false;
                else
                    debugger; // 为什么为空，是否被允许？
            });
            this._selectedGameObjects = editorData.selectedGameObjects;
            this._selectedGameObjects.forEach(element =>
            {
                this.getNode(element).selected = true;
            });
        }

        private ongameobjectadded(event: feng3d.Event<feng3d.GameObject>)
        {
            this.add(event.data);
        }

        private ongameobjectremoved(event: feng3d.Event<feng3d.GameObject>)
        {
            var node = nodeMap.get(event.data);
            this.remove(node);
        }

        private init(gameobject: feng3d.GameObject)
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

        private add(gameobject: feng3d.GameObject)
        {
            if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node)
            {
                node.remove();
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode)
            {
                if (!node)
                {
                    node = new HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                parentnode.addChild(node);
            }
            gameobject.children.forEach(element =>
            {
                this.add(element);
            });
            return node;
        }

        private remove(node: HierarchyNode)
        {
            if (!node) return;
            node.children.forEach(element =>
            {
                this.remove(element);
            });
            node.remove();
        }
    }
    var nodeMap = new Map<feng3d.GameObject, HierarchyNode>();

    hierarchy = new Hierarchy();
}