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

        cameraObj: Object3D;

        constructor()
        {
            this.init();

            this.cameraObj = new Object3D("camera");
            this.cameraObj.transform.z = -500;
            this.cameraObj.transform.y = 300;
            this.cameraObj.transform.lookAt(new Vector3D());
            this.cameraObj.addComponent(this.view3D.camera);
            editor3DData.cameraObject3D = this.cameraObj;
            //
            $ticker.addEventListener(Event.ENTER_FRAME, this.process, this);
        }

        private process(event: Event)
        {
            editor3DData.mouseInView3D.copyFrom(this.view3D.mousePos);
            editor3DData.view3DRect.copyFrom(this.view3D.viewRect);
        }

        private init()
        {
            var canvas = document.getElementById("glcanvas");
            this.view3D = new feng3d.View3D(canvas);
            this.scene = this.view3D.scene;

            editor3DData.view3D = this.view3D;
            editor3DData.scene3D = this.view3D.scene;
            editor3DData.camera3D = this.view3D.camera;
            editor3DData.hierarchy = new Hierarchy(this.view3D.scene);

            this.view3D.scene.addChild(new GroundGrid().groundGridObject3D);
            this.view3D.scene.addChild(new Trident());

            //初始化模块
            var object3DControllerTool = new Object3DControllerTool();
            var sceneControl = new SceneControl();
        }
    }
}