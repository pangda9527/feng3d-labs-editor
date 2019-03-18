import { EditorScript } from "./EditorScript";
export declare class CameraIcon extends EditorScript {
    camera: feng3d.Camera;
    init(gameObject: feng3d.GameObject): void;
    initicon(): void;
    update(): void;
    dispose(): void;
    private _lightIcon;
    private _lightLines;
    private _lightpoints;
    private _segmentGeometry;
    private _pointGeometry;
    private _lensChanged;
    private onCameraChanged;
    private onLensChanged;
    private onScenetransformChanged;
    private onMousedown;
}
//# sourceMappingURL=CameraIcon.d.ts.map