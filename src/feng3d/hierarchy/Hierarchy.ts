module feng3d.editor
{
    export class Hierarchy
    {
        public readonly rootNode: HierarchyNode;
        private readonly nodeMap = new Map<GameObject, HierarchyNode>();

        public get selectedNode()
        {
            return this.nodeMap.get(editor3DData.selectedObject);
        }

        constructor(rootObject3D: GameObject)
        {
            this.rootNode = new HierarchyNode(rootObject3D);
            this.rootNode.depth = -1;
            this.nodeMap.push(rootObject3D, this.rootNode);
            //
            rootObject3D.on("click", this.onMouseClick, this);
            $editorEventDispatcher.on("Create_Object3D", this.onCreateObject3D, this);
            $editorEventDispatcher.on("saveScene", this.onSaveScene, this);
            $editorEventDispatcher.on("import", this.onImport, this);

            //监听命令
            shortcut.on("deleteSeletedObject3D", this.onDeleteSeletedObject3D, this);
        }

        /**
         * 获取节点
         */
        public getNode(object3D: GameObject)
        {
            var node = this.nodeMap.get(object3D);
            return node;
        }

        public addObject3D(object3D: GameObject, parentNode: HierarchyNode = null, allChildren = false)
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
                for (var i = 0; i < object3D.numChildren; i++)
                {
                    this.addObject3D(object3D.getChildAt(i), node, true);
                }
            }
            return node;
        }

        private onMouseClick(event: EventVO<any>)
        {
            var object3D = <Transform>event.target;
            var node = this.nodeMap.get(object3D.gameObject);
            while (!node && (object3D == object3D.parent));
            {
                node = this.nodeMap.get(object3D.gameObject);
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
                this.addObject3D(gameobject);
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
                var node = this.nodeMap.get(selectedObject3D);
                node.delete();
            }
            editor3DData.selectedObject = null;
        }

        public resetScene(scene: Scene3D)
        {
            for (var i = 0; i < scene.gameObject.numChildren; i++)
            {
                this.addObject3D(scene.gameObject.getChildAt(i), null, true);
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
                        // var json = JSON.parse(reader.result);
                        // var scene: Scene3D = GameObject.des Serialization.deserialize(json);

                        // editor3DData.hierarchy.resetScene(scene);
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
            var obj = this.rootNode.object3D.serialize();
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

    export interface HierarchyNodeEventMap
    {
        added: HierarchyNode;
        removed: HierarchyNode;
        openChanged: HierarchyNode;
    }

    export interface HierarchyNode
    {
        once<K extends keyof HierarchyNodeEventMap>(type: K, listener: (event: HierarchyNodeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof HierarchyNodeEventMap>(type: K, data?: HierarchyNodeEventMap[K], bubbles?: boolean);
        has<K extends keyof HierarchyNodeEventMap>(type: K): boolean;
        on<K extends keyof HierarchyNodeEventMap>(type: K, listener: (event: HierarchyNodeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof HierarchyNodeEventMap>(type?: K, listener?: (event: HierarchyNodeEventMap[K]) => any, thisObject?: any);
    }

    export class HierarchyNode extends Event
    {
        public object3D: GameObject;
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

        constructor(object3D: GameObject)
        {
            super();
            this.object3D = object3D;
            this.label = object3D.name;
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
            this.dispatch("added", node, true);
        }

        public removeNode(node: HierarchyNode)
        {
            node.parent = null;
            this.object3D.removeChild(node.object3D);
            var index = this.children.indexOf(node);
            console.assert(index != -1);
            this.children.splice(index, 1);
            this.hasChildren = this.children.length > 0;
            this.dispatch("removed", node, true);
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
            this.dispatch("openChanged", this, true);
        }

        //------------------------------------------
        // Private Properties
        //------------------------------------------
        private _uuid: string;
    }
}