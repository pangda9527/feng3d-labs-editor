module feng3d.editor
{
    export var engine: Engine;

    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    export class Main3D
    {
        constructor()
        {
            this.init();
        }

        private init()
        {
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new Engine(canvas);
            engine.scene.background = new Color(0.4, 0.4, 0.4, 1.0);

            engine.root.addComponent(EditorComponent);

            hierarchy = new Hierarchy(engine.root);

            //
            var camera = engine.camera;
            camera.transform.z = 500;
            camera.transform.y = 300;
            camera.transform.lookAt(new Vector3D());

            var trident = GameObject.create("Trident");
            trident.addComponent(Trident);
            trident.mouseEnabled = false;
            engine.root.addChild(trident);

            //初始化模块
            var groundGrid = GameObject.create("GroundGrid").addComponent(GroundGrid);
            engine.root.addChild(groundGrid.gameObject);

            var cubeTexture = new TextureCube([
                'resource/3d/skybox/px.jpg',
                'resource/3d/skybox/py.jpg',
                'resource/3d/skybox/pz.jpg',
                'resource/3d/skybox/nx.jpg',
                'resource/3d/skybox/ny.jpg',
                'resource/3d/skybox/nz.jpg',
            ]);

            var skybox = GameObject.create("skybox");
            skybox.mouseEnabled = false;
            var skyBoxComponent = skybox.addComponent(SkyBox);
            skyBoxComponent.texture = cubeTexture;
            engine.root.addChild(skybox);

            var directionalLight = GameObject.create("DirectionalLight");
            directionalLight.addComponent(DirectionalLight);
            directionalLight.transform.rx = 120;
            engine.root.addChild(directionalLight)

            var object3DControllerTool = GameObject.create("object3DControllerTool").addComponent(Object3DControllerTool);

            //
            var sceneControl = new SceneControl();

            this.test();
        }

        private test()
        {
            engine.root.on("mousedown", (event) =>
            {
                var gameobject = <GameObject>event.target;
                var names = [gameobject.name];
                while (gameobject.parent)
                {
                    gameobject = gameobject.parent;
                    names.push(gameobject.name);
                }
                // console.log(event.type, names.reverse().join("->"));
            }, this);
        }
    }
}