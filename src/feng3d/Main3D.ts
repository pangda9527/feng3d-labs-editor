module feng3d.editor
{

    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    export class Main3D
    {
        view3D: View3D;
        controller: FPSController;
        cameraObj: Object3D;

        constructor()
        {
            this.init();

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
            canvas.addEventListener("mouseout",this.onMouseup.bind(this))
        }

        private onMousedown()
        {
            this.controller.target = this.cameraObj.transform;
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

            //初始化颜色材质
            var cube = new CubeObject3D();
            cube.transform.z = 300;
            this.view3D.scene.addChild(cube);

            //变化旋转与颜色
            setInterval(function ()
            {
                cube.transform.ry += 1;
            }, 15);

            this.view3D.scene.addChild(new GroundGrid().groundGridObject3D);
            this.view3D.scene.addChild(new Trident());

            new MousePickTest(this.view3D.scene);
        }
    }
}