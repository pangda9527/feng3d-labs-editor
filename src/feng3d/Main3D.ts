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

            editor3DData.view3D = this.view3D;
            editor3DData.camera3D = this.view3D.camera;
            editor3DData.hierarchy = new Hierarchy();
            editor3DData.hierarchy.scene = this.view3D.scene;


            this.cameraObj = new Object3D("camera");
            this.cameraObj.transform.z = -500;
            this.cameraObj.transform.y = 300;
            this.cameraObj.transform.lookAt(new Vector3D());
            this.cameraObj.addComponent(this.view3D.camera);
            //
            this.controller = new FPSController();
            //
            $ticker.addEventListener(Event.ENTER_FRAME, this.process, this);

            shortcut.addEventListener("fpsViewStart", this.onFpsViewStart, this);
            shortcut.addEventListener("fpsViewStop", this.onFpsViewStop, this);
            shortcut.addEventListener("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            shortcut.addEventListener("mouseRotateScene", this.onMouseRotateScene, this);
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
            this.rotateSceneMousePoint = new Point(input.clientX, input.clientY);
            this.rotateSceneCameraGlobalMatrix3D = editor3DData.camera3D.globalMatrix3D.clone();
            this.rotateSceneCenter = null;
            if (editor3DData.selectedObject3D)
            {
                this.rotateSceneCenter = editor3DData.selectedObject3D.transform.globalPosition;
            } else
            {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleBy(300);
                this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        }

        private onMouseRotateScene()
        {
            var camera3D = editor3DData.camera3D;
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new Point(input.clientX, input.clientY);
            var view3DRect = editor3DData.view3DRect;
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

            editor3DData.mouseInView3D.copyFrom(this.view3D.mousePos);
            editor3DData.view3DRect.copyFrom(this.view3D.viewRect);
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