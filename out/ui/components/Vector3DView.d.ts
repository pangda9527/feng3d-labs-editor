export declare class Vector3DView extends eui.Component implements eui.UIComponent {
    group: eui.Group;
    xTextInput: eui.TextInput;
    yTextInput: eui.TextInput;
    zTextInput: eui.TextInput;
    wGroup: eui.Group;
    wTextInput: eui.TextInput;
    vm: feng3d.Vector3 | feng3d.Vector4;
    private _vm;
    constructor();
    showw: any;
    private _showw;
    private onComplete;
    private onAddedToStage;
    private onRemovedFromStage;
    private addItemEventListener;
    private removeItemEventListener;
    private _textfocusintxt;
    private ontxtfocusin;
    private ontxtfocusout;
    updateView(): void;
    private onTextChange;
}
//# sourceMappingURL=Vector3DView.d.ts.map