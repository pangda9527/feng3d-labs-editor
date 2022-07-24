import { View, Scene, Camera, GameObject, Geometry, Material, PerspectiveLens, serialization, Texture2D, TextureCube, Vector3, Renderable, GeometryLike } from 'feng3d';


/**
 * feng3d预览图工具
 */
export class Feng3dScreenShot
{
    static get feng3dScreenShot()
    {
        this._feng3dScreenShot = this._feng3dScreenShot || new Feng3dScreenShot();
        return this._feng3dScreenShot;
    }
    private static _feng3dScreenShot: Feng3dScreenShot;

    view: View;

    scene: Scene;

    camera: Camera;

    container: GameObject;

    defaultGeometry = Geometry.getDefault("Sphere");

    defaultMaterial = Material.getDefault("Default-Material");

    constructor()
    {
        // 初始化3d
        var view = this.view = new View();
        view.canvas.style.visibility = "hidden";
        view.setSize(64, 64);
        //
        var scene = this.scene = view.scene;
        scene.background.fromUnit(0xff525252);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);
        //
        var camera = this.camera = view.camera;
        camera.lens = new PerspectiveLens(45);
        //
        var light = serialization.setValue(new GameObject(), {
            name: "DirectionalLight",
            components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
        });
        scene.gameObject.addChild(light);

        this.container = new GameObject();
        this.container.name = "渲染截图容器";
        scene.gameObject.addChild(this.container);

        view.stop();
    }

    /**
     * 绘制贴图
     * @param texture 贴图
     */
    drawTexture(texture: Texture2D)
    {
        var image: ImageData | HTMLImageElement = <any>texture.activePixels;

        var w = 64;
        var h = 64;

        var canvas2D = document.createElement("canvas");
        canvas2D.width = w;
        canvas2D.height = h;
        var context2D = canvas2D.getContext("2d");

        context2D.fillStyle = "black";

        if (image instanceof HTMLImageElement)
            context2D.drawImage(image, 0, 0, w, h);
        else if (image instanceof ImageData)
            context2D.putImageData(image, 0, 0);
        else
            context2D.fillRect(0, 0, w, h);

        //
        var dataUrl = canvas2D.toDataURL();
        return dataUrl;
    }

    /**
     * 绘制立方体贴图
     * @param textureCube 立方体贴图
     */
    drawTextureCube(textureCube: TextureCube)
    {
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
    drawMaterial(material: Material, cameraRotation = new Vector3(20, -90, 0))
    {
        var mode = this.materialObject.getComponent(Renderable);
        mode.geometry = this.defaultGeometry;
        mode.material = material;

        //
        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(this.materialObject);
        return this;
    }

    /**
     * 绘制材质
     * @param geometry 材质
     */
    drawGeometry(geometry: GeometryLike, cameraRotation = new Vector3(-20, 120, 0))
    {
        var model = this.geometryObject.getComponent(Renderable);
        model.geometry = geometry;
        model.material = this.defaultMaterial;

        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(this.geometryObject);
        return this;
    }

    /**
     * 绘制游戏对象
     * @param gameObject 游戏对象
     */
    drawGameObject(gameObject: GameObject, cameraRotation = new Vector3(20, -120, 0))
    {
        cameraRotation && (this.camera.transform.rotation = cameraRotation);
        this._drawGameObject(gameObject);
        return this;
    }

    /**
     * 转换为DataURL
     */
    toDataURL(width = 64, height = 64)
    {
        this.view.setSize(width, height);
        this.view.render();
        var dataUrl = this.view.canvas.toDataURL();
        return dataUrl;
    }

    updateCameraPosition(gameObject: GameObject)
    {
        //
        var bounds = gameObject.boundingBox.worldBounds;
        var scenePosition = bounds.getCenter();
        var size = bounds.getSize().length;
        size = Math.max(size, 1);
        var lookDistance = size;
        var lens = this.camera.lens;
        if (lens instanceof PerspectiveLens)
        {
            lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
        }
        //
        var lookPos = this.camera.transform.localToWorldMatrix.getAxisZ();
        lookPos.scaleNumber(-lookDistance);
        lookPos.add(scenePosition);
        var localLookPos = lookPos.clone();
        if (this.camera.transform.parent)
        {
            localLookPos = this.camera.transform.parent.worldToLocalMatrix.transformPoint3(lookPos);
        }
        this.camera.transform.position = localLookPos;
    }

    private materialObject = serialization.setValue(new GameObject(), { components: [{ __class__: "feng3d.MeshRenderer" }] });
    private geometryObject = serialization.setValue(new GameObject(), { components: [{ __class__: "feng3d.MeshRenderer", }, { __class__: "feng3d.WireframeComponent", }] });

    private _drawGameObject(gameObject: GameObject)
    {
        this.container.removeChildren();
        //
        this.container.addChild(gameObject);
        //
        this.updateCameraPosition(gameObject);
    }

}
