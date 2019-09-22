namespace editor
{
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
            editorAsset.initproject(() =>
            {
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
            });

            window.addEventListener("beforeunload", () =>
            {
                let obj = feng3d.serialization.serialize(editorData.gameScene.gameObject);
                editorRS.fs.writeObject("default.scene.json", obj);
            });
        }
    }

    export function creatNewScene()
    {
        var scene = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "Untitled" }).addComponent(feng3d.Scene3D)
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);

        var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
        camera.addComponent(feng3d.AudioListener);
        camera.transform.position = new feng3d.Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);

        var directionalLight = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "DirectionalLight" });
        directionalLight.addComponent(feng3d.DirectionalLight).shadowType = feng3d.ShadowType.Hard_Shadows;
        directionalLight.transform.rx = 50;
        directionalLight.transform.ry = -30;
        directionalLight.transform.y = 3;
        scene.gameObject.addChild(directionalLight);

        return scene;
    }
}