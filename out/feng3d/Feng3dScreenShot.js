"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * feng3d缩略图工具
 */
var Feng3dScreenShot = /** @class */ (function () {
    function Feng3dScreenShot() {
        this.defaultGeometry = feng3d.Geometry.sphere;
        this.defaultMaterial = feng3d.Material.default;
        this.materialObject = Object.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshModel" }] });
        this.geometryObject = Object.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshModel", }, { __class__: "feng3d.WireframeComponent", }] });
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
        var light = Object.setValue(new feng3d.GameObject(), {
            name: "DirectionalLight",
            components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
        });
        scene.gameObject.addChild(light);
        engine.stop();
    }
    // /**
    //  * 绘制贴图
    //  * @param texture 贴图
    //  */
    // drawTexture(texture: feng3d.Texture2D, width?: number, height?: number)
    // {
    //     var image: ImageData | HTMLImageElement = <any>texture.activePixels;
    //     var w = width || (image && image.width) || 64;
    //     var h = height || (image && image.height) || 64;
    //     var canvas2D = document.createElement("canvas");
    //     canvas2D.width = w;
    //     canvas2D.height = h;
    //     var context2D = canvas2D.getContext("2d");
    //     context2D.fillStyle = "black";
    //     if (image instanceof HTMLImageElement)
    //         context2D.drawImage(image, 0, 0, w, h);
    //     else if (image instanceof ImageData)
    //         context2D.putImageData(image, 0, 0);
    //     else
    //         context2D.fillRect(0, 0, w, h);
    //     //
    //     var dataUrl = canvas2D.toDataURL();
    //     return dataUrl;
    // }
    /**
     * 绘制立方体贴图
     * @param textureCube 立方体贴图
     */
    Feng3dScreenShot.prototype.drawTextureCube = function (textureCube) {
        var pixels = textureCube["_pixels"];
        var canvas2D = document.createElement("canvas");
        var width = 64;
        canvas2D.width = width;
        canvas2D.height = width;
        var context2D = canvas2D.getContext("2d");
        context2D.fillStyle = "black";
        // context2D.fillRect(10, 10, 100, 100);
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
        if (pixels[1])
            context2D.drawImage(pixels[1], X, Y + Yoffset, w4, w4);
        else
            context2D.fillRect(X, Y + Yoffset, w4, w4);
        //
        X = w4;
        Y = w4;
        if (pixels[2])
            context2D.drawImage(pixels[2], X, Y + Yoffset, w4, w4);
        else
            context2D.fillRect(X, Y + Yoffset, w4, w4);
        //
        X = 0;
        Y = w4;
        if (pixels[3])
            context2D.drawImage(pixels[3], X, Y + Yoffset, w4, w4);
        else
            context2D.fillRect(X, Y + Yoffset, w4, w4);
        //
        X = w4;
        Y = w4 * 2;
        if (pixels[4])
            context2D.drawImage(pixels[4], X, Y + Yoffset, w4, w4);
        else
            context2D.fillRect(X, Y + Yoffset, w4, w4);
        //
        X = w4 * 3;
        Y = w4;
        if (pixels[5])
            context2D.drawImage(pixels[5], X, Y + Yoffset, w4, w4);
        else
            context2D.fillRect(X, Y + Yoffset, w4, w4);
        //
        var dataUrl = canvas2D.toDataURL();
        return dataUrl;
    };
    /**
     * 绘制材质
     * @param material 材质
     */
    Feng3dScreenShot.prototype.drawMaterial = function (material, cameraRotation) {
        if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(20, -90, 0); }
        var mode = this.materialObject.getComponent(feng3d.Model);
        mode.geometry = this.defaultGeometry;
        mode.material = material;
        //
        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(this.materialObject);
        return this;
    };
    /**
     * 绘制材质
     * @param geometry 材质
     */
    Feng3dScreenShot.prototype.drawGeometry = function (geometry, cameraRotation) {
        if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(-20, 120, 0); }
        var model = this.geometryObject.getComponent(feng3d.Model);
        model.geometry = geometry;
        model.material = this.defaultMaterial;
        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(this.geometryObject);
        return this;
    };
    /**
     * 绘制游戏对象
     * @param gameObject 游戏对象
     */
    Feng3dScreenShot.prototype.drawGameObject = function (gameObject, cameraRotation) {
        if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(20, -120, 0); }
        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(gameObject);
        return this;
    };
    /**
     * 转换为DataURL
     */
    Feng3dScreenShot.prototype.toDataURL = function (width, height) {
        if (width === void 0) { width = 64; }
        if (height === void 0) { height = 64; }
        this.engine.setSize(width, height);
        this.engine.render();
        var dataUrl = this.engine.canvas.toDataURL();
        return dataUrl;
    };
    Feng3dScreenShot.prototype.updateCameraPosition = function () {
        //
        var bounds = this.currentObject.worldBounds;
        var scenePosition = bounds.getCenter();
        var size = bounds.getSize().length;
        size = Math.max(size, 1);
        var lookDistance = size;
        var lens = this.camera.lens;
        if (lens instanceof feng3d.PerspectiveLens) {
            lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
        }
        //
        var lookPos = this.camera.transform.localToWorldMatrix.forward;
        lookPos.scaleNumber(-lookDistance);
        lookPos.add(scenePosition);
        var localLookPos = lookPos.clone();
        if (this.camera.transform.parent) {
            localLookPos = this.camera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
        }
        this.camera.transform.position = localLookPos;
    };
    Feng3dScreenShot.prototype._drawGameObject = function (gameObject) {
        if (this.currentObject) {
            this.scene.gameObject.removeChild(this.currentObject);
            this.currentObject = null;
        }
        //
        this.scene.gameObject.addChild(gameObject);
        this.currentObject = gameObject;
        //
        this.updateCameraPosition();
    };
    return Feng3dScreenShot;
}());
exports.Feng3dScreenShot = Feng3dScreenShot;
exports.feng3dScreenShot = new Feng3dScreenShot();
//# sourceMappingURL=Feng3dScreenShot.js.map