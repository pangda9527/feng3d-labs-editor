/**
 * 下拉列表
 */
class ComboBox extends eui.Component implements eui.UIComponent
{
	public label: eui.Label;
	public list: eui.List

	/**
	 * 数据
	 */
	// dataProvider: { label: string, value: any }[] = [];
	dataProvider: { label: string, value: any }[] = [
		{ label: "1", value: 1 },
		{ label: "2", value: 1 },
		{ label: "3", value: 1 },
		{ label: "4", value: 1 },
	];
	/**
	 * 选中数据
	 */
	data: { label: string, value: any };

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

		feng3d.editor.editorui.popupLayer.addChild(this.list);
		feng3d.editor.maskview.mask(this.list);
	}

	private onlistChange()
	{
		this.data = this.list.selectedItem;
		this.updateview();

		if (this.list.parent)
			this.list.parent.removeChild(this.list);
	}
}