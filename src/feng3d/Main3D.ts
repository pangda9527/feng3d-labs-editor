namespace feng3d.editor
{
    export var engine: Engine;
    export var editorCamera: Camera;
    var editorObject: GameObject

    export class EditorEngine extends Engine
    {
        get scene()
        {
            return this._scene;
        }
        set scene(value)
        {
            if (this._scene)
            {
                this._scene.iseditor = false;
                this._scene.gameObject.removeChild(editorObject);
            }
            this._scene = value;
            if (this._scene)
            {
                this._scene.iseditor = true;
                this._scene.gameObject.addChild(editorObject);
                hierarchy.rootGameObject = this._scene.gameObject;
            }
        }
        private _scene: Scene3D;
    }

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
            editorCamera.transform.x = 5;
            editorCamera.transform.y = 3;
            editorCamera.transform.z = 5;
            editorCamera.transform.lookAt(new Vector3D());
            //
            editorCamera.gameObject.addComponent(FPSController).auto = false;
            //
            editorObject = GameObject.create("editorObject");
            editorObject.serializable = false;
            editorObject.showinHierarchy = false;
            editorObject.addComponent(SceneRotateTool);
            //
            editorObject.addComponent(Trident);
            //初始化模块
            editorObject.addComponent(GroundGrid);
            editorObject.addComponent(MRSTool);
            editorObject.addComponent(EditorComponent);
            //
            editorDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
            //
            var scene = newScene();
            //
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new EditorEngine(canvas, scene, editorCamera);

            editorAssets.readScene("default.scene", (err, scene) =>
            {
                engine.scene = scene;
            });

            window.addEventListener("beforeunload", () =>
            {
                editorAssets.saveScene("default.scene", engine.scene);
            });

            // var cubeTexture = new TextureCube([
            //     'resource/3d/skybox/px.jpg',
            //     'resource/3d/skybox/py.jpg',
            //     'resource/3d/skybox/pz.jpg',
            //     'resource/3d/skybox/nx.jpg',
            //     'resource/3d/skybox/ny.jpg',
            //     'resource/3d/skybox/nz.jpg',
            // ]);

            // var skyBoxComponent = scene.gameObject.addComponent(SkyBox);
            // skyBoxComponent.texture = cubeTexture;
        }

        private onEditorCameraRotate(e: Event<Vector3D>)
        {
            var resultRotation = e.data;
            var camera = editorCamera;
            var forward = camera.transform.forwardVector;
            var lookDistance: number;
            if (editorData.selectedGameObjects.length > 0)
            {
                //计算观察距离
                var selectedObj = editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.scenePosition.subtract(camera.transform.scenePosition);
                lookDistance = Math.max(0, forward.dotProduct(lookray));
            } else
            {
                lookDistance = sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.scenePosition.add(forward.scaleBy(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new Quaternion();
            resultRotation.scaleBy(Math.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * Math.DEG2RAD, camera.transform.ry * Math.DEG2RAD, camera.transform.rz * Math.DEG2RAD)
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: () =>
                {
                    var cameraQuat = new Quaternion();
                    cameraQuat.slerp(sourceQuat, targetQuat, rate.rate);
                    camera.transform.orientation = cameraQuat;
                    //
                    var translation = camera.transform.forwardVector;
                    translation.negate();
                    translation.scaleBy(lookDistance);
                    camera.transform.position = rotateCenter.add(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        }
    }

    function newScene()
    {
        var scene = GameObject.create("Untitled").addComponent(Scene3D)
        scene.background = new Color(0.4, 0.4, 0.4, 1.0);

        var camera = GameObjectFactory.createCamera("Main Camera");
        scene.gameObject.addChild(camera);

        var directionalLight = GameObject.create("DirectionalLight");
        directionalLight.addComponent(DirectionalLight);
        directionalLight.transform.rx = 120;
        scene.gameObject.addChild(directionalLight);

        return scene;
    }
}