declare namespace editor {
    class OAVGameObjectName extends OAVBase {
        nameInput: eui.TextInput;
        visibleCB: eui.CheckBox;
        mouseEnabledCB: eui.CheckBox;
        space: feng3d.GameObject;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onVisibleCBClick;
        private onMouseEnabledCBClick;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
    }
}
//# sourceMappingURL=OAVGameObjectName.d.ts.map