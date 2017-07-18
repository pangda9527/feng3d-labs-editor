module feng3d.editor
{
    export class Hierarchy
    {
        public readonly rootNode: HierarchyNode;
        private readonly nodeMap = new Map<Transform, HierarchyNode>();

        public get selectedNode()
        {
            return this.nodeMap.get(editor3DData.selectedObject.transform);
        }

        constructor(rootObject3D: Transform)
        {
            this.rootNode = new HierarchyNode(rootObject3D);
            this.rootNode.depth = -1;
            this.nodeMap.push(rootObject3D, this.rootNode);
            //
            Event.on(rootObject3D, "click", this.onMouseClick, this);
            Event.on($editorEventDispatcher, <any>"Create_Object3D", this.onCreateObject3D, this);
            Event.on($editorEventDispatcher, <any>"saveScene", this.onSaveScene, this);
            Event.on($editorEventDispatcher, <any>"import", this.onImport, this);

            //监听命令
            Event.on(shortcut, <any>"deleteSeletedObject3D", this.onDeleteSeletedObject3D, this);
        }

        /**
         * 获取节点
         */
        public getNode(object3D: Transform)
        {
            var node = this.nodeMap.get(object3D);
            return node;
        }

        public addObject3D(object3D: Transform, parentNode: HierarchyNode = null, allChildren = false)
        {
            var node = new HierarchyNode(object3D);
            this.nodeMap.push(object3D, node);
            if (parentNode)
            {
                parentNode.addNode(node);
            } else
            {
                this.rootNode.addNode(node);
            }
            if (allChildren)
            {
                for (var i = 0; i < object3D.childCount; i++)
                {
                    this.addObject3D(object3D.getChildAt(i) as Transform, node, true);
                }
            }
            return node;
        }

        private onMouseClick(event:EventVO<"click">)
        {
            var object3D = <Transform>event.target;
            var node = this.nodeMap.get(object3D);
            while (!node && (object3D = <Transform>object3D.parent));
            {
                node = this.nodeMap.get(object3D);
            }
            if (node && object3D)
                editor3DData.selectedObject = object3D.gameObject;
        }

        private onCreateObject3D(event: EventVO<any>)
        {
            var className = event.data.className;
            var gameobject = GameObjectFactory.create(event.data.label);
            if (gameobject)
            {
                this.addObject3D(gameobject.transform);
                editor3DData.selectedObject = gameobject;
            } else
            {
                console.error(`无法实例化${className},请检查配置 createObjectConfig`)
            }
        }

        private onDeleteSeletedObject3D()
        {
            var selectedObject3D = editor3DData.selectedObject;
            if (selectedObject3D)
            {
                var node = this.nodeMap.get(selectedObject3D.transform);
                node.delete();
            }
            editor3DData.selectedObject = null;
        }

        public resetScene(scene: Scene3D)
        {
            for (var i = 0; i < scene.transform.childCount; i++)
            {
                this.addObject3D(scene.transform.getChildAt(i) as Transform, null, true);
            }
        }

        private onImport()
        {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', function (event)
            {
                if (fileInput.files.length == 0)
                    return;
                var file = fileInput.files[0];

                // try sending
                var reader = new FileReader();

                reader.onloadstart = function ()
                {
                    console.log("onloadstart");
                }

                reader.onprogress = function (p)
                {
                    console.log("onprogress");
                }

                reader.onload = function ()
                {
                    console.log("load complete");
                }

                reader.onloadend = function ()
                {
                    if (reader.error)
                    {
                        console.log(reader.error);
                    } else
                    {
                        var json = JSON.parse(reader.result);
                        var scene: Scene3D = Serialization.deserialize(json);

                        editor3DData.hierarchy.resetScene(scene);
                    }
                }

                reader.readAsBinaryString(file);
            });

            document.addEventListener("mouseup", onmouseup, true);

            function onmouseup(e)
            {
                fileInput.click();
                e.preventDefault();
                document.removeEventListener("mouseup", onmouseup, true)
            }

        }

        private onSaveScene()
        {
            var obj = Serialization.serialize(this.rootNode.object3D);
            obj;

            var output = "";

            try
            {
                output = JSON.stringify(obj, null, '\t');
                output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

            } catch (e)
            {
                output = JSON.stringify(output);
            }

            var link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link); // Firefox workaround, see #6594

            link.href = URL.createObjectURL(new Blob([output], { type: 'text/plain' }));
            link.download = 'scene.json';
            link.click();
            //to do 删除 link
        }
    }

    export class HierarchyNode
    {
        public static readonly ADDED = "added";
        public static readonly REMOVED = "removed";
        public static readonly OPEN_CHANGED = "openChanged";

        public object3D: Transform;
        public label: string;
        public depth: number = 0;
        public isOpen: boolean = true;
        public hasChildren: boolean;

        public get uuid()
        {
            return this._uuid;
        }

        /** 
         * 父节点
         */
        public parent: HierarchyNode;
        /**
         * 子节点列表
         */
        public children: HierarchyNode[] = [];

        constructor(object3D: Transform)
        {
            this.object3D = object3D;
            this.label = object3D.gameObject.name;
            this._uuid = Math.generateUUID();

            eui.Watcher.watch(this, ["isOpen"], this.onIsOpenChange, this);
        }

        /**
         * 判断是否包含节点
         */
        public contain(node: HierarchyNode)
        {
            if (this == node)
                return true;
            for (var i = 0; i < this.children.length; i++)
            {
                if (this.children[i].contain(node))
                    return true;
            }
            return false;
        }

        public addNode(node: HierarchyNode)
        {
            debuger && console.assert(!node.contain(this), "无法添加到自身节点中!");

            node.parent = this;
            this.object3D.addChild(node.object3D);
            this.children.push(node);
            node.depth = this.depth + 1;
            node.updateChildrenDepth();
            this.hasChildren = true;
            Event.dispatch(this, <any>HierarchyNode.ADDED, node, true);
        }

        public removeNode(node: HierarchyNode)
        {
            node.parent = null;
            this.object3D.removeChild(node.object3D);
            var index = this.children.indexOf(node);
            console.assert(index != -1);
            this.children.splice(index, 1);
            this.hasChildren = this.children.length > 0;
            Event.dispatch(this, <any>HierarchyNode.REMOVED, node, true);
        }

        public delete()
        {
            this.parent.removeNode(this);
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].delete();
            }
            this.children.length = 0;
        }

        public updateChildrenDepth()
        {
            this.children.forEach(element =>
            {
                element.depth = this.depth + 1;
                element.updateChildrenDepth();
            });
        }

        public getShowNodes()
        {
            var nodes: HierarchyNode[] = [];
            if (this.isOpen)
            {
                this.children.forEach(element =>
                {
                    nodes.push(element);
                    nodes = nodes.concat(element.getShowNodes());
                });
            }
            return nodes;
        }

        public onIsOpenChange()
        {
            Event.dispatch(this, <any>HierarchyNode.OPEN_CHANGED, this, true);
        }

        //------------------------------------------
        // Private Properties
        //------------------------------------------
        private _uuid: string;
    }
}