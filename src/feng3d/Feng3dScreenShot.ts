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

        camera: feng3d.Camera;

        defaultGeometry = feng3d.Geometry.sphere;

        defaultMaterial = feng3d.Material.default;

        constructor()
        {
            // 初始化3d
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
            //
            var light = new feng3d.GameObject().value({
                name: "DirectionalLight",
                components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
            });
            scene.gameObject.addChild(light);
            engine.stop();
        }

        /**
         * 绘制立方体贴图
         * @param texture 贴图
         */
        drawTexture(texture: feng3d.UrlImageTexture2D)
        {
            var image = texture["image"];

            var canvas2D = document.createElement("canvas");
            var width = 64;
            canvas2D.width = width;
            canvas2D.height = width;
            var context2D = canvas2D.getContext("2d");

            context2D.fillStyle = "black";

            if (image)
                context2D.drawImage(image, 0, 0, width, width);
            else
                context2D.fillRect(0, 0, width, width);

            //
            var dataUrl = canvas2D.toDataURL();
            return dataUrl;
        }

        /**
         * 绘制立方体贴图
         * @param textureCube 立方体贴图
         */
        drawTextureCube(textureCube: feng3d.TextureCube)
        {
            var pixels = textureCube["_pixels"];

            var canvas2D = document.createElement("canvas");
            var width = 64;
            canvas2D.width = width;
            canvas2D.height = width;
            var context2D = canvas2D.getContext("2d");

            context2D.fillStyle = "black";
            // context2D.fillRect(10, 10, 100, 100);

            feng3d.imageUtil.createImageData

            var w4 = Math.round(width / 4);
            var Yoffset = w4 / 2;
            //
            var X = w4 * 2;
            var Y = w4;
            if (pixels[0])
                context2D.drawImage(pixels[0], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = 0;
            if (pixels[1]) context2D.drawImage(pixels[1], X, Y + Yoffset, w4, w4);
            else context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4;
            if (pixels[2]) context2D.drawImage(pixels[2], X, Y + Yoffset, w4, w4);
            else context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = 0;
            Y = w4;
            if (pixels[3]) context2D.drawImage(pixels[3], X, Y + Yoffset, w4, w4);
            else context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4 * 2;
            if (pixels[4]) context2D.drawImage(pixels[4], X, Y + Yoffset, w4, w4);
            else context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4 * 3;
            Y = w4;
            if (pixels[5]) context2D.drawImage(pixels[5], X, Y + Yoffset, w4, w4);
            else context2D.fillRect(X, Y + Yoffset, w4, w4);

            //
            var dataUrl = canvas2D.toDataURL();
            return dataUrl;
        }

        /**
         * 绘制材质
         * @param material 材质
         */
        drawMaterial(material: feng3d.Material)
        {
            var gameObject = new feng3d.GameObject().value({
                components: [{
                    __class__: "feng3d.MeshModel",
                    geometry: this.defaultGeometry,
                    material: material,
                }]
            });

            this.camera.transform.rotation = new feng3d.Vector3(20, -90, 0);
            var dataUrl = this._drawGameObject(gameObject);
            return dataUrl;
        }

        /**
         * 绘制材质
         * @param geometry 材质
         */
        drawGeometry(geometry: feng3d.Geometrys)
        {
            var gameObject = new feng3d.GameObject().value({
                components: [{
                    __class__: "feng3d.MeshModel",
                    geometry: geometry,
                    material: this.defaultMaterial,
                }, {
                    __class__: "feng3d.WireframeComponent",
                    // color: new feng3d.Color4(0, 0, 0, 1),
                }]
            });

            this.camera.transform.rotation = new feng3d.Vector3(-20, 120, 0);
            var dataUrl = this._drawGameObject(gameObject);
            return dataUrl;
        }

        /**
         * 绘制游戏对象
         * @param gameObject 游戏对象
         */
        drawGameObject(gameObject: feng3d.GameObject)
        {
            this.camera.transform.rotation = new feng3d.Vector3(20, -120, 0);
            var dataUrl = this._drawGameObject(gameObject);
            return dataUrl;
        }

        private _drawGameObject(gameObject: feng3d.GameObject)
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