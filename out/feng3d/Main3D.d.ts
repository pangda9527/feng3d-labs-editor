import { EditorComponent } from "./EditorComponent";
export declare var engine: feng3d.Engine;
export declare var editorCamera: feng3d.Camera;
export declare var editorScene: feng3d.Scene3D;
export declare var editorComponent: EditorComponent;
export declare class EditorEngine extends feng3d.Engine {
    scene: feng3d.Scene3D;
    readonly camera: feng3d.Camera;
    private _scene;
    wireframeColor: feng3d.Color4;
    /**
     * 绘制场景
     */
    render(): void;
}
/**
* 编辑器3D入口
*/
export declare class Main3D {
    constructor();
    private init;
    private onEditorCameraRotate;
}
export declare function creatNewScene(): feng3d.Scene3D;
//# sourceMappingURL=Main3D.d.ts.map