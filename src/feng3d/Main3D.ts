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
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            var view3D = new feng3d.View3D(canvas);
            view3D.scene.background.fromUnit(0x666666);

            editor3DData.view3D = view3D;
            editor3DData.scene3D = view3D.scene;
            editor3DData.cameraObject3D = view3D.camera;
            editor3DData.hierarchy = new Hierarchy(view3D.scene.transform);

            //
            var camera = view3D.camera;
            camera.transform.z = -500;
            camera.transform.y = 300;
            camera.transform.lookAt(new Vector3D());

            var trident = new GameObject("Trident");
            trident.addComponent(Trident);
            view3D.scene.transform.addChild(trident.transform);
            serializationConfig.excludeObject.push(trident);

            //初始化模块
            var groundGrid = new GroundGrid();
            view3D.scene.transform.addChild(groundGrid.transform);
            serializationConfig.excludeObject.push(groundGrid);

            var object3DControllerTool = new Object3DControllerTool();
            serializationConfig.excludeObject.push(object3DControllerTool);

            //
            var sceneControl = new SceneControl();

            this.test();
        }

        private test()
        {
            editor3DData.scene3D.transform.addEventListener(Mouse3DEvent.CLICK, (event) =>
            {
                var transform = <Transform><any>event.target;
                var names = [transform.gameObject.name];
                while (transform.parent)
                {
                    transform = transform.parent;
                    names.push(transform.gameObject.name);
                }
                console.log(event.type, names.reverse().join("->"));
            }, this);

            input.addEventListener(inputType.CLICK, () =>
            {
                var gameobject = new GameObject("test");
                gameobject.addComponent(MeshRenderer).material = new StandardMaterial();
                gameobject.addComponent(MeshFilter).mesh = new SphereGeometry(10);
                gameobject.transform.mouseEnabled = false;
                editor3DData.scene3D.transform.addChild(gameobject.transform);
                var mouseRay3D = editor3DData.view3D.getMouseRay3D();
                gameobject.transform.position = mouseRay3D.position;
                var direction = mouseRay3D.direction.clone();

                var num = 1000;
                var translate = () =>
                {
                    gameobject.transform.translate(direction, 15);
                    if (num > 0)
                    {
                        setTimeout(function ()
                        {
                            translate();
                        }, 1000 / 60);
                    } else
                    {
                        editor3DData.scene3D.transform.removeChild(gameobject.transform);
                    }
                    num--;
                }
                translate();

            }, this);
        }
    }
}