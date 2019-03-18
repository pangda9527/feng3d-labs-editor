export declare var feng3dScreenShot: Feng3dScreenShot;
/**
 * feng3d缩略图工具
 */
export declare class Feng3dScreenShot {
    engine: feng3d.Engine;
    scene: feng3d.Scene3D;
    camera: feng3d.Camera;
    defaultGeometry: feng3d.SphereGeometry;
    defaultMaterial: feng3d.Material;
    constructor();
    /**
     * 绘制立方体贴图
     * @param textureCube 立方体贴图
     */
    drawTextureCube(textureCube: feng3d.TextureCube): string;
    /**
     * 绘制材质
     * @param material 材质
     */
    drawMaterial(material: feng3d.Material, cameraRotation?: feng3d.Vector3): this;
    /**
     * 绘制材质
     * @param geometry 材质
     */
    drawGeometry(geometry: feng3d.Geometrys, cameraRotation?: feng3d.Vector3): this;
    /**
     * 绘制游戏对象
     * @param gameObject 游戏对象
     */
    drawGameObject(gameObject: feng3d.GameObject, cameraRotation?: feng3d.Vector3): this;
    /**
     * 转换为DataURL
     */
    toDataURL(width?: number, height?: number): string;
    updateCameraPosition(): void;
    private currentObject;
    private materialObject;
    private geometryObject;
    private _drawGameObject;
}
//# sourceMappingURL=Feng3dScreenShot.d.ts.map