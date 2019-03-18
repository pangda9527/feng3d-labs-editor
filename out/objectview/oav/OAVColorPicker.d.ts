import { OAVBase } from "./OAVBase";
export declare class OAVColorPicker extends OAVBase {
    labelLab: eui.Label;
    colorPicker: editor.ColorPicker;
    input: eui.TextInput;
    attributeValue: feng3d.Color3 | feng3d.Color4;
    constructor(attributeViewInfo: feng3d.AttributeViewInfo);
    initView(): void;
    dispose(): void;
    updateView(): void;
    protected onChange(event: egret.Event): void;
    private _textfocusintxt;
    private ontxtfocusin;
    private ontxtfocusout;
    private onTextChange;
}
//# sourceMappingURL=OAVColorPicker.d.ts.map