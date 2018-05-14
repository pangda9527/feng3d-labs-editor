namespace feng3d.editor
{
    @OAVComponent()
    export class OAVMaterialName extends OAVBase
    {
        public tileIcon: eui.Image;
        public nameLabel: eui.Label;
        public operationBtn: eui.Button;
        public helpBtn: eui.Button;
        public shaderComboBox: ComboBox;
        public group: eui.Group;

        //
        space: Material;

        constructor(attributeViewInfo: AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OVMaterial";
        }

        initView()
        {
            this.shaderComboBox.addEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            globalEvent.on("shaderChanged", this.onShaderComboBoxChange, this);
        }

        dispose()
        {
            this.shaderComboBox.removeEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            globalEvent.off("shaderChanged", this.onShaderComboBoxChange, this);
        }

        updateView()
        {
            var material = this.space;
            this.nameLabel.text = material.shaderName;

            var data = shaderlib.getShaderNames().sort().map((v) => { return { label: v, value: v } });
            var selected = data.reduce((prevalue, item) =>
            {
                if (prevalue) return prevalue;
                if (item.value == material.shaderName)
                    return item;
                return null;
            }, null);
            this.shaderComboBox.dataProvider = data;
            this.shaderComboBox.data = selected;
        }

        private onShaderComboBoxChange()
        {
            this.attributeValue = this.shaderComboBox.data.value;
            this.objectView.space = this.space;
        }
    }
}