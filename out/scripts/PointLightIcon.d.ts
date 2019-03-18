import { EditorScript } from "./EditorScript";
export declare class PointLightIcon extends EditorScript {
    light: feng3d.PointLight;
    init(gameObject: feng3d.GameObject): void;
    initicon(): void;
    update(): void;
    dispose(): void;
    private _lightIcon;
    private _lightLines;
    private _lightpoints;
    private _textureMaterial;
    private _segmentGeometry;
    private _pointGeometry;
    private onLightChanged;
    private onScenetransformChanged;
    private onMousedown;
}
//# sourceMappingURL=PointLightIcon.d.ts.map