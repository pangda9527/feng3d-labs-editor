declare namespace editor {
    class OAVMinMaxCurve extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveView: editor.MinMaxCurveView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
//# sourceMappingURL=OAVMinMaxCurve.d.ts.map