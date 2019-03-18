import { EditorScript } from "./EditorScript";
export declare class SpotLightIcon extends EditorScript {
    light: feng3d.SpotLight;
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
//# sourceMappingURL=SpotLightIcon.d.ts.map