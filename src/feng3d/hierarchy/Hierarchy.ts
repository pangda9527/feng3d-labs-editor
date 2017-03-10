module feng3d.editor
{
    export class Hierarchy
    {
        public rootNode: HierarchyNode;

        private nodeMap = new Map<Object3D, HierarchyNode>();

        public get selectedNode()
        {
            return this.nodeMap.get(editor3DData.selectedObject3D);
        }

        constructor(rootObject3D: Object3D)
        {
            this.rootNode = this.getNode(rootObject3D);
            this.rootNode.depth = -1;

            $editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);

            //监听命令
            shortcut.addEventListener("deleteSeletedObject3D", this.onDeleteSeletedObject3D, this);
        }

        /**
         * 获取节点
         */
        public getNode(object3D: Object3D)
        {
            if (object3D == null)
                return null;
            var node = this.nodeMap.get(object3D);
            if (!node)
            {
                node = new HierarchyNode(object3D);
                this.nodeMap.push(object3D, node);
            }
            return node;
        }

        public addObject3D(object3D: Object3D)
        {
            var node = this.getNode(object3D);
            this.rootNode.addNode(node);

            object3D.addEventListener(Mouse3DEvent.CLICK, this.onMouseClick, this);
        }

        private onMouseClick(event: Mouse3DEvent)
        {
            var object3D: Object3D = <Object3D>event.currentTarget;
            editor3DData.selectedObject3D = object3D;
            event.isStopBubbles = true;
        }

        private onCreateObject3D(event: Event)
        {
            var createdObject: Object3D;
            switch (event.data)
            {
                case "Object":
                    createdObject = new Object3D();
                    break;
                case "Plane":
                    createdObject = new PlaneObject3D();
                    break;
                case "Cube":
                    createdObject = new CubeObject3D();
                    break;
                case "Sphere":
                    createdObject = new SphereObject3D();
                    break;
                case "Capsule":
                    createdObject = new CapsuleObject3D();
                    break;
                case "Cylinder":
                    createdObject = new CylinderObject3D();
                    break;
                case "Cone":
                    createdObject = new ConeObject3D();
                    break;
                case "Particle":
                    createdObject = new ParticleObject3D();
                    break;
                case "Camera":
                    createdObject = new CameraObject3D();
                    break;
            }
            if (createdObject)
            {
                this.addObject3D(createdObject);
                editor3DData.selectedObject3D = createdObject;
            }
        }

        private onDeleteSeletedObject3D()
        {
            var selectedObject3D = editor3DData.selectedObject3D;
            if (selectedObject3D)
            {
                var node = this.nodeMap.get(selectedObject3D);
                node.delete();
            }
            editor3DData.selectedObject3D = null;
        }
    }

    export class HierarchyNode extends EventDispatcher
    {
        public static readonly ADDED = "added";
        public static readonly REMOVED = "removed";
        public static readonly OPEN_CHANGED = "openChanged";

        public object3D: Object3D;
        public label: string;
        public depth: number = 0;
        public isOpen: boolean = true;
        public hasChildren: boolean;


        /** 
         * 父节点
         */
        public parent: HierarchyNode;
        /**
         * 子节点列表
         */
        public children: HierarchyNode[] = [];

        constructor(object3D: Object3D)
        {
            super();
            this.object3D = object3D;
            this.label = object3D.name;

            Watcher.watch(this, ["isOpen"], this.onIsOpenChange, this);
        }

        public addNode(node: HierarchyNode)
        {
            node.parent = this;
            this.object3D.addChild(node.object3D);
            this.children.push(node);
            node.depth = this.depth + 1;
            node.updateChildrenDepth();
            this.hasChildren = true;
            this.dispatchEvent(new Event(HierarchyNode.ADDED, node, true));
        }

        public removeNode(node: HierarchyNode)
        {
            node.parent = null;
            this.object3D.removeChild(node.object3D);
            var index = this.children.indexOf(node);
            if (index != -1)
            {
                this.children.splice(index, 1);
            }
            this.hasChildren = this.children.length > 0;
            this.dispatchEvent(new Event(HierarchyNode.REMOVED, node, true));
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
            this.dispatchEvent(new Event(HierarchyNode.OPEN_CHANGED, this, true));
        }
    }
}