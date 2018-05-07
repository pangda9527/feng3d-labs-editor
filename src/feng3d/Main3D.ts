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
                this._scene.updateScriptFlag = ScriptFlag.feng3d;
            }
            this._scene = value;
            if (this._scene)
            {
                this._scene.iseditor = true;
                this._scene.gameObject.addChild(editorObject);
                this._scene.updateScriptFlag = ScriptFlag.editor;
                hierarchy.rootGameObject = this._scene.gameObject;
            }
        }
        get camera()
        {
            return editorCamera;
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
            editorCamera.transform.lookAt(new Vector3());
            //
            editorCamera.gameObject.addComponent(FPSController).auto = false;
            //
            editorObject = GameObject.create("editorObject");
            editorObject.flag = GameObjectFlag.editor;
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
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new EditorEngine(canvas, null, editorCamera);
            engine.renderObjectflag = GameObjectFlag.feng3d | GameObjectFlag.editor;
            //
            editorAssets.readScene("default.scene.json", (err, scene) =>
            {
                if (err)
                    engine.scene = newScene();
                else
                    engine.scene = scene;
            });

            window.addEventListener("beforeunload", () =>
            {
                editorAssets.saveScene("default.scene.json", engine.scene);
            });
        }

        private onEditorCameraRotate(e: Event<Vector3>)
        {
            var resultRotation = e.data;
            var camera = editorCamera;
            var forward = camera.transform.forwardVector;
            var lookDistance: number;
            if (editorData.selectedGameObjects.length > 0)
            {
                //计算观察距离
                var selectedObj = editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.scenePosition.subTo(camera.transform.scenePosition);
                lookDistance = Math.max(0, forward.dot(lookray));
            } else
            {
                lookDistance = sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.scenePosition.addTo(forward.scale(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new Quaternion();
            resultRotation.scale(FMath.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * FMath.DEG2RAD, camera.transform.ry * FMath.DEG2RAD, camera.transform.rz * FMath.DEG2RAD)
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
                    translation.scale(lookDistance);
                    camera.transform.position = rotateCenter.addTo(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        }
    }

    function newScene()
    {
        var scene = GameObject.create("Untitled").addComponent(Scene3D)
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);

        var camera = GameObjectFactory.createCamera("Main Camera");
        camera.transform.position = new Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);

        var directionalLight = GameObject.create("DirectionalLight");
        directionalLight.addComponent(DirectionalLight);
        directionalLight.transform.rx = 50;
        directionalLight.transform.ry = -30;
        directionalLight.transform.y = 3;
        scene.gameObject.addChild(directionalLight);

        return scene;
    }
}