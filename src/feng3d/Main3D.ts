namespace editor
{
    export var engine: feng3d.Engine;
    export var editorCamera: feng3d.Camera;
    var editorObject: feng3d.GameObject

    export class EditorEngine extends feng3d.Engine
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
                this._scene.updateScriptFlag = feng3d.ScriptFlag.feng3d;
            }
            this._scene = value;
            if (this._scene)
            {
                this._scene.iseditor = true;
                this._scene.gameObject.addChild(editorObject);
                this._scene.updateScriptFlag = feng3d.ScriptFlag.editor;
                hierarchy.rootGameObject = this._scene.gameObject;
            }
        }
        get camera()
        {
            return editorCamera;
        }
        private _scene: feng3d.Scene3D;
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
            editorCamera = feng3d.GameObject.create("editorCamera").addComponent(feng3d.Camera);
            editorCamera.transform.x = 5;
            editorCamera.transform.y = 3;
            editorCamera.transform.z = 5;
            editorCamera.transform.lookAt(new feng3d.Vector3());
            //
            editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
            //
            editorObject = feng3d.GameObject.create("editorObject");
            editorObject.flag = feng3d.GameObjectFlag.editor;
            editorObject.serializable = false;
            editorObject.showinHierarchy = false;
            editorObject.addComponent(SceneRotateTool);
            //
            //初始化模块
            editorObject.addComponent(GroundGrid);
            editorObject.addComponent(MRSTool);
            editorObject.addComponent(EditorComponent);

            feng3d.Loader.loadText(editorData.getEditorAssetsPath("gameobjects/Trident.gameobject.json"), (content) =>
            {
                var trident = feng3d.serialization.deserialize(JSON.parse(content));
                editorObject.addChild(trident);
            });

            //
            editorDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
            //
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new EditorEngine(canvas, null, editorCamera);
            engine.renderObjectflag = feng3d.GameObjectFlag.feng3d | feng3d.GameObjectFlag.editor;
            //
            editorAssets.runProjectScript(() =>
            {
                editorAssets.readScene("default.scene.json", (err, scene) =>
                {
                    if (err)
                        engine.scene = creatNewScene();
                    else
                        engine.scene = scene;
                });
            });

            window.addEventListener("beforeunload", () =>
            {
                editorAssets.saveScene("default.scene.json", engine.scene);
            });
        }

        private onEditorCameraRotate(e: feng3d.Event<feng3d.Vector3>)
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
            var targetQuat = new feng3d.Quaternion();
            resultRotation.scale(feng3d.FMath.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new feng3d.Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * feng3d.FMath.DEG2RAD, camera.transform.ry * feng3d.FMath.DEG2RAD, camera.transform.rz * feng3d.FMath.DEG2RAD)
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: () =>
                {
                    var cameraQuat = new feng3d.Quaternion();
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

    export function creatNewScene()
    {
        var scene = feng3d.GameObject.create("Untitled").addComponent(feng3d.Scene3D)
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);

        var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
        camera.transform.position = new feng3d.Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);

        var directionalLight = feng3d.GameObject.create("DirectionalLight");
        directionalLight.addComponent(feng3d.DirectionalLight);
        directionalLight.transform.rx = 50;
        directionalLight.transform.ry = -30;
        directionalLight.transform.y = 3;
        scene.gameObject.addChild(directionalLight);

        return scene;
    }
}