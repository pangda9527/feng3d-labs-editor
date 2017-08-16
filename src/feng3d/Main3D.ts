namespace feng3d.editor
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
            ticker.on("enterFrame", this.process, this);
        }

        private process(event: EventVO<any>)
        {
            editor3DData.mouseInView3D.copyFrom(editor3DData.view3D.mousePos);
            editor3DData.view3DRect.copyFrom(editor3DData.view3D.viewRect);
        }

        private init()
        {
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            var view3D = new Engine(canvas);
            view3D.scene.background.fromUnit(0x666666);

            editor3DData.view3D = view3D;
            editor3DData.scene3D = view3D.scene;
            editor3DData.camera = view3D.camera;
            editor3DData.hierarchy = new Hierarchy(view3D.scene.gameObject);

            //
            var camera = view3D.camera;
            camera.transform.z = -500;
            camera.transform.y = 300;
            camera.transform.lookAt(new Vector3D());

            var trident = GameObject.create("Trident");
            trident.addComponent(Trident);
            view3D.scene.gameObject.addChild(trident);

            //初始化模块
            var groundGrid = GameObject.create("GroundGrid").addComponent(GroundGrid);
            view3D.scene.gameObject.addChild(groundGrid.gameObject);

            var object3DControllerTool = GameObject.create("object3DControllerTool").addComponent(Object3DControllerTool);

            //
            var sceneControl = new SceneControl();

            this.test();
        }

        private test()
        {
            editor3DData.scene3D.gameObject.on("mousedown", (event) =>
            {
                var gameobject = <GameObject>event.target;
                var names = [gameobject.name];
                while (gameobject.parent)
                {
                    gameobject = gameobject.parent;
                    names.push(gameobject.name);
                }
                console.log(event.type, names.reverse().join("->"));
            }, this);

            // this.testMouseRay();
        }

        private testMouseRay()
        {
            input.on("click", () =>
            {
                var gameobject = GameObject.create("test");
                gameobject.addComponent(MeshRenderer).material = new StandardMaterial();
                gameobject.addComponent(MeshFilter).mesh = new SphereGeometry(10);
                gameobject.mouseEnabled = false;
                editor3DData.scene3D.gameObject.addChild(gameobject);
                var mouseRay3D = editor3DData.camera.getMouseRay3D()
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
                        editor3DData.scene3D.gameObject.removeChild(gameobject);
                    }
                    num--;
                }
                translate();

            }, this);
        }
    }
}