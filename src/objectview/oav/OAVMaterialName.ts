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

        protected onComplete(): void
        {
            super.onComplete();
            this.updateView();
        }

        updateView()
        {
            var material = this.space;
            this.nameLabel.text = material.shaderName;

            var data = shaderlib.getShaderNames().sort().map((v) => { return { label: v, value: v } });
            var selected = data.reduce((prevalue, item) =>
            {
                if (prevalue) return prevalue;
                if (item.value.indexOf(material.shaderName) != -1)
                    return item;
                return null;
            }, null);
            this.shaderComboBox.dataProvider = data;
            this.shaderComboBox.data = selected;
        }
    }
}