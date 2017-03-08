module feng3d.editor
{

    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    export class Main3D
    {

        constructor()
        {
            this.init();
            //
            ticker.addEventListener(Event.ENTER_FRAME, this.process, this);
        }

        private process(event: Event)
        {
            editor3DData.mouseInView3D.copyFrom(editor3DData.view3D.mousePos);
            editor3DData.view3DRect.copyFrom(editor3DData.view3D.viewRect);
        }

        private init()
        {
            var canvas = document.getElementById("glcanvas");
            var view3D = new feng3d.View3D(canvas);

            editor3DData.view3D = view3D;
            editor3DData.scene3D = view3D.scene;
            editor3DData.cameraObject3D = view3D.camera;
            editor3DData.hierarchy = new Hierarchy(view3D.scene);

            //
            var camera = view3D.camera;
            camera.transform.position.z = -500;
            camera.transform.position.y = 300;
            camera.transform.lookAt(new Vector3D());

            view3D.scene.addChild(new Trident());

            //初始化模块
            var groundGrid = new GroundGrid();

            var object3DControllerTool = new Object3DControllerTool();
            var sceneControl = new SceneControl();
        }
    }
}