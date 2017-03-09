module feng3d.editor
{
	export class Tree extends eui.List
	{
		public constructor()
		{
			super();
			this.itemRenderer = TreeItemRenderer;
		}
	}
}