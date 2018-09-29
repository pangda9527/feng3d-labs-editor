namespace editor
{
    export var feng3dScreenShot: Feng3dScreenShot;

    /**
     * feng3d缩略图工具
     */
    export class Feng3dScreenShot
    {
        engine: feng3d.Engine;

        scene: feng3d.Scene3D;

        gameObject: feng3d.GameObject;

        model: feng3d.Model;

        camera: feng3d.Camera;

        defaultGeometry = feng3d.Geometry.cube;

        defaultMaterial = feng3d.Material.default;

        constructor()
        {
            //
            var engine = this.engine = new feng3d.Engine();
            engine.canvas.style.visibility = "hidden";
            engine.setSize(64, 64);
            //
            var scene = this.scene = engine.scene;
            scene.background.fromUnit(0xff525252);
            scene.ambientColor.setTo(0.4, 0.4, 0.4);
            //
            var camera = this.camera = engine.camera;
            camera.lens = new feng3d.PerspectiveLens(45);
            camera.transform.position = new feng3d.Vector3(1.0, 0.8, -2.0);
            camera.transform.lookAt(new feng3d.Vector3());
            //
            var light = new feng3d.GameObject().value({
                name: "DirectionalLight",
                components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
            });
            scene.gameObject.addChild(light);
            engine.stop();

            this.gameObject = new feng3d.GameObject();
            this.model = this.gameObject.addComponent(feng3d.Model);
        }

        /**
         * 绘制材质
         * @param material 材质
         */
        drawMaterial(material: feng3d.Material)
        {
            this.model.geometry = this.defaultGeometry;
            this.model.material = material;

            var dataUrl = this.drawGameObject(this.gameObject);
            return dataUrl;
        }

        /**
         * 绘制材质
         * @param geometry 材质
         */
        drawGeometry(geometry: feng3d.Geometrys)
        {
            this.model.geometry = geometry;
            this.model.material = this.defaultMaterial;

            var dataUrl = this.drawGameObject(this.gameObject);
            return dataUrl;
        }

        drawGameObject(gameObject: feng3d.GameObject)
        {
            //
            this.updateCameraPosition(gameObject);

            //
            this.scene.gameObject.addChild(gameObject);
            this.engine.render();
            var dataUrl = this.engine.canvas.toDataURL();
            this.scene.gameObject.removeChild(gameObject);
            return dataUrl;
        }

        private updateCameraPosition(gameObject: feng3d.GameObject)
        {
            //
            var bounds = gameObject.worldBounds;
            var scenePosition = bounds.getCenter();
            var size = bounds.getSize().length;
            size = Math.max(size, 1);
            var lookDistance = size;
            var lens = this.camera.lens;
            if (lens instanceof feng3d.PerspectiveLens)
            {
                lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
            }
            //
            var lookPos = this.camera.transform.localToWorldMatrix.forward;
            lookPos.scale(-lookDistance);
            lookPos.add(scenePosition);
            var localLookPos = lookPos.clone();
            if (this.camera.transform.parent)
            {
                localLookPos = this.camera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
            }
            this.camera.transform.position = localLookPos;
        }
    }

    feng3dScreenShot = new Feng3dScreenShot();
}