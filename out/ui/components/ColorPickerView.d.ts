/**
 */
export declare class ColorPickerView extends eui.Component {
    group0: eui.Group;
    image0: eui.Image;
    pos0: eui.Group;
    group1: eui.Group;
    image1: eui.Image;
    pos1: eui.Group;
    txtR: eui.TextInput;
    txtG: eui.TextInput;
    txtB: eui.TextInput;
    groupA: eui.Group;
    txtA: eui.TextInput;
    txtColor: eui.TextInput;
    color: feng3d.Color3 | feng3d.Color4;
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private _mouseDownGroup;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private _textfocusintxt;
    protected ontxtfocusin(e: egret.Event): void;
    protected ontxtfocusout(e: egret.Event): void;
    private onTextChange;
    private onColorChanged;
    private basecolor;
    private rw;
    private rh;
    private ratio;
    private updateView;
    private _groupAParent;
}
export declare var colorPickerView: ColorPickerView;
//# sourceMappingURL=ColorPickerView.d.ts.map