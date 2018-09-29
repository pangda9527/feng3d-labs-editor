namespace editor
{
    export var feng3dScreenShot: Feng3dScreenShot;

    /**
     * feng3d缩略图工具
     */
    export class Feng3dScreenShot
    {
        engine: feng3d.Engine;

        gameObject: feng3d.GameObject;

        model: feng3d.Model;

        constructor()
        {
            //
            var engine = this.engine = new feng3d.Engine();
            engine.canvas.style.visibility = "hidden";
            engine.setSize(100, 100);
            engine.scene.background.fromUnit(0xff525252);
            engine.scene.ambientColor.setTo(0.4, 0.4, 0.4);
            //
            engine.camera.lens = new feng3d.PerspectiveLens(45);
            engine.camera.transform.position = new feng3d.Vector3(1.0, 0.8, -2.0);
            engine.camera.transform.lookAt(new feng3d.Vector3());
            //
            var light = new feng3d.GameObject().value({
                name: "DirectionalLight",
                components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
            });
            engine.scene.gameObject.addChild(light);
            engine.stop();

            var gameObject = this.gameObject = new feng3d.GameObject();
            this.model = this.gameObject.addComponent(feng3d.Model);
            engine.scene.gameObject.addChild(gameObject);
        }

        drawMaterial(material: feng3d.Material, geometry = feng3d.Geometry.cube)
        {
            this.model.geometry = geometry;
            this.model.material = material;
            this.engine.render();
            var dataUrl = this.engine.canvas.toDataURL();
            return dataUrl;
        }
    }

    feng3dScreenShot = new Feng3dScreenShot();
}