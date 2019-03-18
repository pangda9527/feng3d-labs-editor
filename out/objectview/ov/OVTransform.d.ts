export declare class OVTransform extends eui.Component implements feng3d.IObjectView {
    xTextInput: eui.TextInput;
    yTextInput: eui.TextInput;
    zTextInput: eui.TextInput;
    rxTextInput: eui.TextInput;
    ryTextInput: eui.TextInput;
    rzTextInput: eui.TextInput;
    sxTextInput: eui.TextInput;
    syTextInput: eui.TextInput;
    szTextInput: eui.TextInput;
    private _space;
    private _objectViewInfo;
    constructor(objectViewInfo: feng3d.ObjectViewInfo);
    private onComplete;
    private onAddedToStage;
    private onRemovedFromStage;
    private addItemEventListener;
    private removeItemEventListener;
    private _textfocusintxt;
    private ontxtfocusin;
    private ontxtfocusout;
    private onTextChange;
    space: feng3d.Transform;
    getAttributeView(attributeName: String): any;
    getblockView(blockName: String): any;
    /**
     * 更新界面
     */
    updateView(): void;
}
//# sourceMappingURL=OVTransform.d.ts.map