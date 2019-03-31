namespace editor
{
    export var editorComponent: EditorComponent;

    export class EditorEngine extends feng3d.Engine
    {
        wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);

        /**
         * 编辑器场景，用于显示只在编辑器中存在的游戏对象，例如灯光Icon，对象操作工具等显示。
         */
        editorScene: feng3d.Scene3D;

        /**
         * 绘制场景
         */
        render()
        {
            if (editorData.gameScene != this.scene)
            {
                if (this.scene)
                {
                    this.scene.runEnvironment = feng3d.RunEnvironment.feng3d;
                }
                this.scene = editorData.gameScene;
                if (this.scene)
                {
                    this.scene.runEnvironment = feng3d.RunEnvironment.editor;
                    hierarchy.rootGameObject = this.scene.gameObject;
                }
            }
            if (editorComponent) editorComponent.scene = this.scene;

            super.render();

            if (this.editorScene)
            {
                this.editorScene.update();
                feng3d.forwardRenderer.draw(this.gl, this.editorScene, this.camera);
                var selectedObject = this.mouse3DManager.pick(this, this.editorScene, this.camera);
                if (selectedObject) this.selectedObject = selectedObject;
            }
            if (this.scene)
            {
                editorData.selectedGameObjects.forEach(element =>
                {
                    if (element.getComponent(feng3d.Model) && !element.getComponent(feng3d.ParticleSystem))
                        feng3d.wireframeRenderer.drawGameObject(this.gl, element, this.scene, this.camera, this.wireframeColor);
                });
            }
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
            editorAsset.runProjectScript(() =>
            {
                editorAsset.readScene("default.scene.json", (err, scene) =>
                {
                    if (err)
                        editorData.gameScene = creatNewScene();
                    else
                        editorData.gameScene = scene;
                });
            });

            window.addEventListener("beforeunload", () =>
            {
                editorRS.fs.writeObject("default.scene.json", editorData.gameScene.gameObject);
            });
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