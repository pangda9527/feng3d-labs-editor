declare namespace editor {
    class OAVMinMaxGradient extends OAVBase {
        labelLab: eui.Label;
        minMaxGradientView: editor.MinMaxGradientView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
//# sourceMappingURL=OAVMinMaxGradient.d.ts.map