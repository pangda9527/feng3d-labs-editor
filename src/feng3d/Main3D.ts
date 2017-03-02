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
            Editor3DData.instance.hierarchy = new Hierarchy();
            Editor3DData.instance.hierarchy.scene = this.view3D.scene;


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

            Editor3DData.instance.mouseInView3D.copyFrom(this.view3D.mousePos);
            Editor3DData.instance.view3DRect.copyFrom(this.view3D.viewRect);
        }

        init()
        {
            var canvas = document.getElementById("glcanvas");
            this.view3D = new feng3d.View3D(canvas);
            this.scene = this.view3D.scene;

            this.view3D.scene.addChild(new GroundGrid().groundGridObject3D);
            this.view3D.scene.addChild(new Trident());

            this.view3D.scene.addChild(new Object3DControllerTool());
        }
    }
}