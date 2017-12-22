namespace feng3d.editor
{
    export var engine: Engine;
    export var editorCamera: Camera;

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
            //
            editorCamera = GameObject.create("editorCamera").addComponent(Camera);
            editorCamera.transform.z = 500;
            editorCamera.transform.y = 300;
            editorCamera.transform.lookAt(new Vector3D());

            var scene = this.newScene();

            hierarchy = new Hierarchy(scene.gameObject);

            //
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new Engine(canvas, scene, editorCamera);
            scene.background = new Color(0.4, 0.4, 0.4, 1.0);

            engine.root.addComponent(EditorComponent);

            var cubeTexture = new TextureCube([
                'resource/3d/skybox/px.jpg',
                'resource/3d/skybox/py.jpg',
                'resource/3d/skybox/pz.jpg',
                'resource/3d/skybox/nx.jpg',
                'resource/3d/skybox/ny.jpg',
                'resource/3d/skybox/nz.jpg',
            ]);

            var skyBoxComponent = scene.gameObject.addComponent(SkyBox);
            skyBoxComponent.texture = cubeTexture;

            this.test();
        }

        private newScene()
        {
            var scene = GameObject.create("Untitled").addComponent(Scene3D)

            var camera = GameObjectFactory.createCamera("Main Camera");
            scene.gameObject.addChild(camera);

            var directionalLight = GameObject.create("DirectionalLight");
            directionalLight.addComponent(DirectionalLight);
            directionalLight.transform.rx = 120;
            scene.gameObject.addChild(directionalLight);

            return scene;
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
                // log(event.type, names.reverse().join("->"));
            }, this);
        }
    }
}