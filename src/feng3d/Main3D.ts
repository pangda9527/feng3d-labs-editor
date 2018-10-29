namespace editor
{
    export var engine: feng3d.Engine;
    export var editorCamera: feng3d.Camera;
    export var editorScene: feng3d.Scene3D;
    export var editorComponent: EditorComponent;

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
                this._scene.runEnvironment = feng3d.RunEnvironment.feng3d;
            }
            this._scene = value;
            if (this._scene)
            {
                this._scene.runEnvironment = feng3d.RunEnvironment.editor;
                hierarchy.rootGameObject = this._scene.gameObject;
            }
            editorComponent.scene = this._scene;
        }
        get camera()
        {
            return editorCamera;
        }
        private _scene: feng3d.Scene3D;

        wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);

        /**
         * 绘制场景
         */
        render()
        {
            super.render();

            editorScene.update();
            feng3d.forwardRenderer.draw(this.gl, editorScene, this.camera);
            var selectedObject = this.mouse3DManager.pick(editorScene, this.camera);
            if (selectedObject) this.selectedObject = selectedObject;

            editorData.selectedGameObjects.forEach(element =>
            {
                if (element.getComponent(feng3d.Model) && !element.getComponent(feng3d.ParticleSystem))
                    feng3d.wireframeRenderer.drawGameObject(this.gl, element, this.scene, this.camera, this.wireframeColor);
            });
        }
    }

    /**
    * 编辑器3D入口
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
            editorCamera = Object.setValue(new feng3d.GameObject(), { name: "editorCamera" }).addComponent(feng3d.Camera);
            editorCamera.lens.far = 5000;
            editorCamera.transform.x = 5;
            editorCamera.transform.y = 3;
            editorCamera.transform.z = 5;
            editorCamera.transform.lookAt(new feng3d.Vector3());
            //
            editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
            //
            editorScene = Object.setValue(new feng3d.GameObject(), { name: "scene" }).addComponent(feng3d.Scene3D);
            editorScene.runEnvironment = feng3d.RunEnvironment.all;
            //
            editorScene.gameObject.addComponent(SceneRotateTool);
            //
            //初始化模块
            editorScene.gameObject.addComponent(GroundGrid);
            editorScene.gameObject.addComponent(MRSTool);
            editorComponent = editorScene.gameObject.addComponent(EditorComponent);

            feng3d.loader.loadText(editorData.getEditorAssetsPath("gameobjects/Trident.gameobject.json"), (content) =>
            {
                var trident: feng3d.GameObject = feng3d.serialization.deserialize(JSON.parse(content));
                editorScene.gameObject.addChild(trident);
            });

            //
            feng3d.feng3dDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
            //
            var canvas = <HTMLCanvasElement>document.getElementById("glcanvas");
            engine = new EditorEngine(canvas, null, editorCamera);
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
                assets.writeObject("default.scene.json", engine.scene.gameObject);
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
        var scene = Object.setValue(new feng3d.GameObject(), { name: "Untitled" }).addComponent(feng3d.Scene3D)
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);

        var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
        camera.addComponent(feng3d.AudioListener);
        camera.transform.position = new feng3d.Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);

        var directionalLight = Object.setValue(new feng3d.GameObject(), { name: "DirectionalLight" });
        directionalLight.addComponent(feng3d.DirectionalLight).shadowType = feng3d.ShadowType.Hard_Shadows;
        directionalLight.transform.rx = 50;
        directionalLight.transform.ry = -30;
        directionalLight.transform.y = 3;
        scene.gameObject.addChild(directionalLight);

        return scene;
    }
}