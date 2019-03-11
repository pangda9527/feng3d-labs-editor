namespace editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public hierachyScroller: eui.Scroller;
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

			this.hierachyScroller.viewport = this.list;

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

			feng3d.watcher.watch(hierarchy, "rootnode", this.onRootNodeChanged, this);
			this.onRootNode(hierarchy.rootnode);

			this.invalidHierarchy();
		}

		private onRemovedFromStage()
		{
			this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
			this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);

			feng3d.watcher.unwatch(hierarchy, "rootnode", this.onRootNodeChanged, this);
			this.offRootNode(hierarchy.rootnode);
		}

		private onRootNodeChanged(host?: any, property?: string, oldvalue?: HierarchyNode)
		{
			this.offRootNode(oldvalue);
			this.onRootNode(hierarchy.rootnode);
		}

		private onRootNode(node: HierarchyNode)
		{
			if (node)
			{
				node.on("added", this.invalidHierarchy, this);
				node.on("removed", this.invalidHierarchy, this);
				node.on("openChanged", this.invalidHierarchy, this);
			}
		}

		private offRootNode(node: HierarchyNode)
		{
			if (node)
			{
				node.off("added", this.invalidHierarchy, this);
				node.off("removed", this.invalidHierarchy, this);
				node.off("openChanged", this.invalidHierarchy, this);
			}
		}

		private invalidHierarchy()
		{
			feng3d.ticker.nextframe(this.updateHierarchyTree, this);
		}

		private updateHierarchyTree()
		{
			var nodes = hierarchy.rootnode.getShowNodes();
			this.listData.replaceAll(nodes);
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
				menu.popup(menuConfig.getCreateObjectMenu(), { mousex: feng3d.windowEventProxy.clientX, mousey: feng3d.windowEventProxy.clientY });
			}
		}
	}
}