namespace feng3d.editor
{
	export class Tree extends eui.List
	{
		constructor()
		{
			super();
			this.itemRenderer = TreeItemRenderer;
		}
	}
}