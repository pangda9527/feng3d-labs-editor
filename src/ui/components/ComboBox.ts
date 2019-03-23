namespace editor
{

	/**
	 * 下拉列表
	 */
	export class ComboBox extends eui.Component implements eui.UIComponent
	{
		public label: eui.Label;
		public list: eui.List

		/**
		 * 数据
		 */
		dataProvider: { label: string, value: any }[] = [];
		/**
		 * 选中数据
		 */
		get data()
		{
			return this._data;
		}
		set data(v)
		{
			this._data = v;
			if (this.label)
			{
				if (this._data)
					this.label.text = this._data.label;
				else
					this.label.text = "";
			}
		}
		_data: { label: string, value: any };

		public constructor()
		{
			super();
			this.skinName = "ComboBoxSkin";
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number): void
		{
			super.$onAddToStage(stage, nestLevel);

			this.init();
			this.updateview();

			this.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
			this.list.addEventListener(egret.Event.CHANGE, this.onlistChange, this);
		}

		$onRemoveFromStage(): void
		{
			super.$onRemoveFromStage();
			this.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
			this.list.removeEventListener(egret.Event.CHANGE, this.onlistChange, this);
		}

		private init()
		{
			this.list = new eui.List();
			this.list.itemRenderer = eui.ItemRenderer;
		}

		private updateview()
		{
			if (this.data == null && this.dataProvider != null)
				this.data = this.dataProvider[0];

			if (this.data)
				this.label.text = this.data.label;
			else
				this.label.text = "";
		}

		private onClick()
		{
			if (!this.dataProvider)
				return;

			this.list.dataProvider = new eui.ArrayCollection(this.dataProvider);

			var rect = this.getTransformedBounds(this.stage);

			this.list.x = rect.left;
			this.list.y = rect.bottom;
			this.list.selectedIndex = this.dataProvider.indexOf(this.data);

			editor.editorui.popupLayer.addChild(this.list);
			editor.maskview.mask(this.list);
		}

		private onlistChange()
		{
			this.data = this.list.selectedItem;
			this.updateview();

			if (this.list.parent)
				this.list.parent.removeChild(this.list);

			this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
		}
	}
}
