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

            shortcut.ShortCut.commandDispatcher.addEventListener("fpsViewStart", this.onFpsViewStart, this);
            shortcut.ShortCut.commandDispatcher.addEventListener("fpsViewStop", this.onFpsViewStop, this);
            shortcut.ShortCut.commandDispatcher.addEventListener("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            shortcut.ShortCut.commandDispatcher.addEventListener("mouseRotateScene", this.onMouseRotateScene, this);
        }

        private onFpsViewStart()
        {
            this.controller.target = this.cameraObj.transform;
        }

        private onFpsViewStop()
        {
            this.controller.target = null;
        }

        private rotateSceneCenter: Vector3D;
        private rotateSceneCameraGlobalMatrix3D: Matrix3D;
        private rotateSceneMousePoint: Point;
        private onMouseRotateSceneStart()
        {
            this.rotateSceneMousePoint = new Point(Input.instance.clientX, Input.instance.clientY);
            this.rotateSceneCameraGlobalMatrix3D = Editor3DData.instance.camera3D.globalMatrix3D.clone();
            this.rotateSceneCenter = null;
            if (Editor3DData.instance.selectedObject3D)
            {
                this.rotateSceneCenter = Editor3DData.instance.selectedObject3D.transform.globalPosition;
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleBy(300);
                this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var camera3D = Editor3DData.instance.camera3D;
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new Point(Input.instance.clientX, Input.instance.clientY);
            var view3DRect = Editor3DData.instance.view3DRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(rotateY, Vector3D.Y_AXIS, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateX, rotateAxisX, this.rotateSceneCenter);
            camera3D.object3D.transform.globalMatrix3D = globalMatrix3D;
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