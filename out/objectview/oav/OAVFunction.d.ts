declare namespace editor {
    class OAVFunction extends OAVBase {
        labelLab: eui.Label;
        button: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected click(event: egret.Event): void;
    }
}
//# sourceMappingURL=OAVFunction.d.ts.map