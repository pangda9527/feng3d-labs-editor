var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var nodeMap = new feng3d.Map();
        var Hierarchy = (function () {
            function Hierarchy(rootObject3D) {
                this.rootNode = new editor.HierarchyNode(rootObject3D);
                nodeMap.push(rootObject3D, this.rootNode);
                //
                rootObject3D.on("click", this.onMouseClick, this);
                editor.$editorEventDispatcher.on("Create_Object3D", this.onCreateObject3D, this);
                editor.$editorEventDispatcher.on("saveScene", this.onSaveScene, this);
                editor.$editorEventDispatcher.on("import", this.onImport, this);
                //监听命令
                feng3d.shortcut.on("deleteSeletedObject3D", this.onDeleteSeletedObject3D, this);
            }
            Object.defineProperty(Hierarchy.prototype, "selectedNode", {
                get: function () {
                    return nodeMap.get(editor.editor3DData.selectedObject);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取节点
             */
            Hierarchy.prototype.getNode = function (object3D) {
                var node = nodeMap.get(object3D);
                return node;
            };
            Hierarchy.prototype.addObject3D = function (object3D, parentNode, allChildren) {
                var _this = this;
                if (parentNode === void 0) { parentNode = null; }
                if (allChildren === void 0) { allChildren = false; }
                if (!object3D.serializable)
                    return;
                if (nodeMap.get(object3D))
                    return;
                var node = new editor.HierarchyNode(object3D);
                feng3d.debuger && console.assert(!nodeMap.get(object3D));
                nodeMap.push(object3D, node);
                if (parentNode) {
                    parentNode.addNode(node);
                }
                else {
                    this.rootNode.addNode(node);
                }
                if (allChildren) {
                    object3D.children.forEach(function (element) {
                        _this.addObject3D(element, node, true);
                    });
                }
                return node;
            };
            Hierarchy.prototype.onMouseClick = function (event) {
                var object3D = event.target;
                var node = nodeMap.get(object3D);
                while (!node && (object3D == object3D.parent))
                    ;
                {
                    node = nodeMap.get(object3D);
                }
                if (node && object3D) {
                    if (object3D.scene.gameObject == object3D) {
                        editor.editor3DData.selectedObject = null;
                    }
                    else {
                        editor.editor3DData.selectedObject = object3D;
                    }
                }
            };
            Hierarchy.prototype.onCreateObject3D = function (event) {
                var className = event.data.className;
                var gameobject = feng3d.GameObjectFactory.create(event.data.label);
                if (gameobject) {
                    this.addObject3D(gameobject);
                    editor.editor3DData.selectedObject = gameobject;
                }
                else {
                    console.error("\u65E0\u6CD5\u5B9E\u4F8B\u5316" + className + ",\u8BF7\u68C0\u67E5\u914D\u7F6E createObjectConfig");
                }
            };
            Hierarchy.prototype.onDeleteSeletedObject3D = function () {
                var selectedObject3D = editor.editor3DData.selectedObject;
                if (selectedObject3D) {
                    feng3d.debuger && console.assert(!!nodeMap.get(selectedObject3D));
                    var node = nodeMap.get(selectedObject3D);
                    node.destroy();
                    nodeMap.delete(selectedObject3D);
                }
                editor.editor3DData.selectedObject = null;
            };
            Hierarchy.prototype.resetScene = function (scene) {
                var _this = this;
                scene.children.forEach(function (element) {
                    _this.addObject3D(element, null, true);
                });
            };
            Hierarchy.prototype.onImport = function () {
                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                fileInput.addEventListener('change', function (event) {
                    if (fileInput.files.length == 0)
                        return;
                    var file = fileInput.files[0];
                    // try sending
                    var reader = new FileReader();
                    reader.onloadstart = function () {
                        console.log("onloadstart");
                    };
                    reader.onprogress = function (p) {
                        console.log("onprogress");
                    };
                    reader.onload = function () {
                        console.log("load complete");
                    };
                    reader.onloadend = function () {
                        if (reader.error) {
                            console.log(reader.error);
                        }
                        else {
                            var json = JSON.parse(reader.result);
                            var scene = feng3d.serialization.deserialize(json);
                            editor.editor3DData.hierarchy.resetScene(scene);
                        }
                    };
                    reader.readAsBinaryString(file);
                });
                document.addEventListener("mouseup", onmouseup, true);
                function onmouseup(e) {
                    fileInput.click();
                    e.preventDefault();
                    document.removeEventListener("mouseup", onmouseup, true);
                }
            };
            Hierarchy.prototype.onSaveScene = function () {
                var obj = feng3d.serialization.serialize(this.rootNode.object3D);
                obj;
                var output = "";
                try {
                    output = JSON.stringify(obj, null, '\t');
                    output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                }
                catch (e) {
                    output = JSON.stringify(output);
                }
                var link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link); // Firefox workaround, see #6594
                link.href = URL.createObjectURL(new Blob([output], { type: 'text/plain' }));
                link.download = 'scene.json';
                link.click();
                //to do 删除 link
            };
            return Hierarchy;
        }());
        editor.Hierarchy = Hierarchy;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Hierarchy.js.map