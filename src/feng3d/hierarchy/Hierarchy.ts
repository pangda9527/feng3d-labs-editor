module feng3d.editor
{
    export class Hierarchy
    {
        public scene: Scene3D;

        constructor()
        {

            $editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);

            //监听命令
            shortcut.ShortCut.commandDispatcher.addEventListener("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
        }

        public addObject3D(object3D: Object3D)
        {
            this.scene.addChild(object3D);

            object3D.addEventListener(Mouse3DEvent.CLICK, this.onMouseClick, this);
        }

        private onMouseClick(event: Mouse3DEvent)
        {
            var object3D: Object3D = <Object3D>event.currentTarget;
            Editor3DData.instance.selectedObject3D = object3D;
        }

        private onCreateObject3D(event: Event)
        {
            switch (event.data)
            {
                case "Plane":
                    this.addObject3D(new PlaneObject3D());
                    break;
                case "Cube":
                    this.addObject3D(new CubeObject3D());
                    break;
                case "Sphere":
                    this.addObject3D(new SphereObject3D());
                    break;
                case "Capsule":
                    this.addObject3D(new CapsuleObject3D());
                    break;
                case "Cylinder":
                    this.addObject3D(new CylinderObject3D());
                    break;
            }
        }

        private onLookToSelectedObject3D()
        {
            var selectedObject3D = Editor3DData.instance.selectedObject3D;
            if (selectedObject3D)
            {
                var lookPos = Editor3DData.instance.camera3D.globalMatrix3D.forward;
                lookPos.scaleBy(-300);
                lookPos.incrementBy(selectedObject3D.transform.globalPosition);
                egret.Tween.get(Editor3DData.instance.camera3D.object3D.transform).to({ x: lookPos.x, y: lookPos.y, z: lookPos.z }, 300, egret.Ease.sineIn);
            }
        }
    }
}