declare namespace editor {
    class OAVMaterialName extends OAVBase {
        tileIcon: eui.Image;
        nameLabel: eui.Label;
        operationBtn: eui.Button;
        helpBtn: eui.Button;
        shaderComboBox: ComboBox;
        group: eui.Group;
        space: feng3d.Material;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onShaderComboBoxChange;
    }
}
//# sourceMappingURL=OAVMaterialName.d.ts.map