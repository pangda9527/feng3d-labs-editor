import { AssetNode } from "../assets/AssetNode";
export declare var drag: Drag;
export declare class Drag {
    register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragData)[], onDragDrop?: (dragSource: DragData) => void): void;
    unregister(displayObject: egret.DisplayObject): void;
    /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
    refreshAcceptables(): void;
}
/**
 * 拖拽数据
 */
export interface DragData {
    gameobject?: feng3d.GameObject;
    animationclip?: feng3d.AnimationClip;
    material?: feng3d.Material;
    geometry?: feng3d.Geometry;
    file_gameobject?: feng3d.GameObject;
    /**
     * 脚本路径
     */
    file_script?: feng3d.ScriptAsset;
    /**
     * 文件
     */
    assetNodes?: AssetNode[];
    /**
     * 声音路径
     */
    audio?: feng3d.AudioAsset;
    /**
     * 纹理
     */
    texture2d?: feng3d.Texture2D;
    /**
     * 立方体纹理
     */
    texturecube?: feng3d.TextureCube;
}
//# sourceMappingURL=Drag.d.ts.map