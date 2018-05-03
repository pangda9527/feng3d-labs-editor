namespace feng3d.editor
{
	/**
	 * 默认基础对象界面
	 * @author feng 2016-3-11
	 */
	@OVComponent()
	export class OVMaterial extends eui.Component implements IObjectView
	{
		public tileIcon: eui.Image;
		public nameLabel: eui.Label;
		public operationBtn: eui.Button;
		public helpBtn: eui.Button;
		public shaderComboBox: ComboBox;
		public group: eui.Group;

		//
		space: Material;
		renderParamsView: IObjectView & eui.Component

		constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this.space = <any>objectViewInfo.owner;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OVMaterial";
		}

		private onComplete(): void
		{
			this.initView();
			this.updateView();
		}

		getAttributeView(attributeName: String): IObjectAttributeView
		{
			return null;
		}

		getblockView(blockName: String): IObjectBlockView
		{
			return null;
		}

		initView()
		{
			this.renderParamsView = objectview.getObjectView(this.space.renderParams, false);
			this.group.addChild(this.renderParamsView);
		}

		/**
		 * 更新界面
		 */
		updateView(): void
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
