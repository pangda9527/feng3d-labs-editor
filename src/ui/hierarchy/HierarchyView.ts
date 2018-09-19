namespace editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;
		public list: eui.List;

		private listData: eui.ArrayCollection;

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
			this.list.itemRenderer = HierarchyTreeItemRenderer;

			this.listData = this.list.dataProvider = new eui.ArrayCollection();

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
			this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);

			hierarchyTree.on("added", this.invalidHierarchy, this);
			hierarchyTree.on("removed", this.invalidHierarchy, this);
			hierarchyTree.on("openChanged", this.invalidHierarchy, this);

			this.updateHierarchyTree();
		}

		private onRemovedFromStage()
		{
			this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
			this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);

			hierarchyTree.off("added", this.invalidHierarchy, this);
			hierarchyTree.off("removed", this.invalidHierarchy, this);
			hierarchyTree.off("openChanged", this.invalidHierarchy, this);
		}

		private invalidHierarchy()
		{
			feng3d.ticker.nextframe(this.updateHierarchyTree, this);
		}

		private updateHierarchyTree()
		{
			var nodes = hierarchyTree.getShowNodes();
			this.listData.replaceAll(nodes);
		}

		private onListbackClick()
		{
			feng3d.log("onListbackClick");
		}

		private onListClick(e: egret.MouseEvent)
		{
			if (e.target == this.list)
			{
				editorData.selectObject(null)
			}
		}

		private onListRightClick(e: egret.MouseEvent)
		{
			if (e.target == this.list)
			{
				editorData.selectObject(null);
				menu.popup(createObjectConfig, feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
			}
		}
	}
}