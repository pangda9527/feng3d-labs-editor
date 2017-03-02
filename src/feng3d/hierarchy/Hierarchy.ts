module feng3d.editor
{
    export class Hierarchy
    {
        public scene: Scene3D;

        constructor()
        {

            $editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);
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
    }
}