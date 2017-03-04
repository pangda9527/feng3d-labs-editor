module feng3d.editor
{
    export class Hierarchy
    {
        public rootNode: HierarchyNode;

        private nodeMap = new Map<Object3D, HierarchyNode>();

        constructor(rootObject3D: Object3D)
        {
            this.rootNode = this.getNode(rootObject3D);

            $editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);

            //监听命令
            shortcut.addEventListener("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
        }

        /**
         * 获取节点
         */
        public getNode(object3D: Object3D)
        {
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
        }

        private onCreateObject3D(event: Event)
        {
            var createdObject: Object3D;
            switch (event.data)
            {
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
            }
            if (createdObject)
            {
                this.addObject3D(createdObject);
                editor3DData.selectedObject3D = createdObject;
            }
        }

        private onLookToSelectedObject3D()
        {
            var selectedObject3D = editor3DData.selectedObject3D;
            if (selectedObject3D)
            {
                var lookPos = editor3DData.camera3D.globalMatrix3D.forward;
                lookPos.scaleBy(-300);
                lookPos.incrementBy(selectedObject3D.transform.globalPosition);
                egret.Tween.get(editor3DData.camera3D.object3D.transform).to({ x: lookPos.x, y: lookPos.y, z: lookPos.z }, 300, egret.Ease.sineIn);
            }
        }
    }

    export class HierarchyNode extends EventDispatcher
    {
        public static readonly ADDED = "added";

        public object3D: Object3D;

        public label: string;

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
        }

        public addNode(node: HierarchyNode)
        {
            this.object3D.addChild(node.object3D);
            this.children.push(node);
            this.dispatchEvent(new Event(HierarchyNode.ADDED, node));
        }
    }
}