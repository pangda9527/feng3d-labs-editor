namespace editor
{
    export var hierarchy: Hierarchy;

    export class Hierarchy
    {
        rootnode: HierarchyNode;

        get rootGameObject()
        {
            return this._rootGameObject;
        }
        set rootGameObject(value)
        {
            if (this._rootGameObject)
            {
                this._rootGameObject.off("added", this.ongameobjectadded, this);
                this._rootGameObject.off("removed", this.ongameobjectremoved, this);
            }
            this._rootGameObject = value;
            if (this._rootGameObject)
            {
                this.init(this._rootGameObject);
                this._rootGameObject.on("added", this.ongameobjectadded, this);
                this._rootGameObject.on("removed", this.ongameobjectremoved, this);
            }
        }
        private _rootGameObject: feng3d.GameObject;

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

        private ongameobjectadded(event: feng3d.Event<feng3d.GameObject>)
        {
            this.add(event.data);
        }

        private ongameobjectremoved(event: feng3d.Event<feng3d.GameObject>)
        {
            this.remove(event.data);
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

        private remove(gameobject: feng3d.GameObject)
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

        addGameoObjectFromAsset(path: string, parent?: feng3d.GameObject)
        {
            assets.readString(path, (err, content: string) =>
            {
                var json = JSON.parse(content);
                var gameobject = feng3d.serialization.deserialize(json);
                gameobject.name = path.split("/").pop().split(".").shift();
                if (parent)
                    parent.addChild(gameobject);
                else
                    this.rootnode.gameobject.addChild(gameobject);
                editorData.selectObject(gameobject);
            });
        }
    }
    var nodeMap = new Map<feng3d.GameObject, HierarchyNode>();

    hierarchy = new Hierarchy();
}