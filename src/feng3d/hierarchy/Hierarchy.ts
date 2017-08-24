namespace feng3d.editor
{
    var nodeMap = new Map<GameObject, HierarchyNode>();

    export class Hierarchy
    {
        readonly rootNode: HierarchyNode;

        get selectedNode()
        {
            return nodeMap.get(editor3DData.selectedObject);
        }

        constructor(rootObject3D: GameObject)
        {
            this.rootNode = new HierarchyNode(rootObject3D);
            nodeMap.push(rootObject3D, this.rootNode);

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
        getNode(object3D: GameObject)
        {
            var node = nodeMap.get(object3D);
            return node;
        }

        addObject3D(object3D: GameObject, parentNode: HierarchyNode = null, allChildren = false)
        {
            if (!object3D.serializable)
                return;
            if (nodeMap.get(object3D))
                return;

            var node = new HierarchyNode(object3D);
            debuger && console.assert(!nodeMap.get(object3D));
            nodeMap.push(object3D, node);

            if (parentNode)
            {
                parentNode.addNode(node);
            } else
            {
                this.rootNode.addNode(node);
            }
            if (allChildren)
            {
                object3D.children.forEach(element =>
                {
                    this.addObject3D(element, node, true);
                });
            }
            return node;
        }

        private onMouseClick(event: EventVO<any>)
        {
            var object3D: GameObject = event.target;
            var node = nodeMap.get(object3D);
            while (!node && (object3D == object3D.parent));
            {
                node = nodeMap.get(object3D);
            }
            if (node && object3D)
            {
                if (object3D.scene.gameObject == object3D)
                {
                    editor3DData.selectedObject = null;
                } else
                {
                    editor3DData.selectedObject = object3D;
                }
            }
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
                debuger && console.assert(!!nodeMap.get(selectedObject3D));
                var node = nodeMap.get(selectedObject3D);
                node.destroy();

                nodeMap.delete(selectedObject3D);
            }
            editor3DData.selectedObject = null;
        }

        resetScene(scene: GameObject)
        {
            scene.children.forEach(element =>
            {
                this.addObject3D(element, null, true);
            });
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
                        var scene: GameObject = serialization.deserialize(json);

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
            var obj = serialization.serialize(this.rootNode.object3D);
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
}