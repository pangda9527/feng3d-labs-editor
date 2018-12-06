class TabViewButton extends eui.Button implements eui.UIComponent
{
	public constructor()
	{
		super();
		this.skinName = "TabViewButtonSkin";
	}

	protected partAdded(partName: string, instance: any): void
	{
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void
	{
		super.childrenCreated();
	}

}