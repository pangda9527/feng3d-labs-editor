import { EditorScript } from "./EditorScript";
export declare class DirectionLightIcon extends EditorScript {
    __class__: "editor.DirectionLightIcon";
    light: feng3d.DirectionalLight;
    init(gameObject: feng3d.GameObject): void;
    initicon(): void;
    update(): void;
    dispose(): void;
    private _lightIcon;
    private _lightLines;
    private _textureMaterial;
    private onLightChanged;
    private onScenetransformChanged;
    private onMousedown;
}
//# sourceMappingURL=DirectionLightIcon.d.ts.map