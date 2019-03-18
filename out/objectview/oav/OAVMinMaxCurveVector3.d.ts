declare namespace editor {
    class OAVMinMaxCurveVector3 extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveVector3View: editor.MinMaxCurveVector3View;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
//# sourceMappingURL=OAVMinMaxCurveVector3.d.ts.map