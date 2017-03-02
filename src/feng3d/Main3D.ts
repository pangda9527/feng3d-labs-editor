module feng3d.editor
{

    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    export class Main3D
    {
        view3D: View3D;
        scene: Scene3D;

        controller: FPSController;
        cameraObj: Object3D;

        constructor()
        {
            this.init();

            Editor3DData.instance.view3D = this.view3D;
            Editor3DData.instance.camera3D = this.view3D.camera;

            this.cameraObj = new Object3D("camera");
            this.cameraObj.transform.z = -500;
            this.cameraObj.transform.y = 300;
            this.cameraObj.transform.lookAt(new Vector3D());
            this.cameraObj.addComponent(this.view3D.camera);
            //
            this.controller = new FPSController();
            //
            $ticker.addEventListener(Event.ENTER_FRAME, this.process, this);

            var canvas = document.getElementById("glcanvas");
            canvas.addEventListener("mousedown", this.onMousedown.bind(this));
            canvas.addEventListener("mouseup", this.onMouseup.bind(this));
            canvas.addEventListener("mouseout", this.onMouseup.bind(this))
        }

        private onMousedown(e)
        {
            if (e.button == 2)
            {
                this.controller.target = this.cameraObj.transform;
            }
        }

        private onMouseup()
        {
            this.controller.target = null;
        }

        process(event: Event)
        {
            this.controller.update();
        }

        init()
        {
            var canvas = document.getElementById("glcanvas");
            this.view3D = new feng3d.View3D(canvas);
            this.scene = this.view3D.scene;

            this.view3D.scene.addChild(new GroundGrid().groundGridObject3D);
            this.view3D.scene.addChild(new Trident());

            this.view3D.scene.addChild(new Object3DControllerTool());

            this.scene.addEventListener(Mouse3DEvent.CLICK, this.onMouseClick, this);
            $editorEventDispatcher.addEventListener("Create_Object3D", this.onCreateObject3D, this);
        }

        onMouseClick(event: Event)
        {
            var object3D: Object3D = <Object3D>event.target;

            Editor3DData.instance.selectedObject3D = object3D;
        }

        private onCreateObject3D(event: Event)
        {
            switch (event.data)
            {
                case "Plane":
                    this.scene.addChild(new PlaneObject3D());
                    break;
                case "Cube":
                    this.scene.addChild(new CubeObject3D());
                    break;
                case "Sphere":
                    this.scene.addChild(new SphereObject3D());
                    break;
                case "Capsule":
                    this.scene.addChild(new CapsuleObject3D());
                    break;
                case "Cylinder":
                    this.scene.addChild(new CylinderObject3D());
                    break;
            }
        }
    }
}