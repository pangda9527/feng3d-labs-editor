module feng3d.editor
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
			this.addButton.addEventListener(MouseEvent.CLICK, this.onAddButtonClick, this);

			hierarchyTree.on("added", this.updateHierarchyTree, this);
			hierarchyTree.on("removed", this.updateHierarchyTree, this);
			hierarchyTree.on("openChanged", this.updateHierarchyTree, this);

			watcher.watch(editor3DData, "selectedObject", this.selectedObject3DChanged, this)

			this.updateHierarchyTree();
		}

		private onRemovedFromStage()
		{
			this.addButton.removeEventListener(MouseEvent.CLICK, this.onAddButtonClick, this);

			hierarchyTree.off("added", this.updateHierarchyTree, this);
			hierarchyTree.off("removed", this.updateHierarchyTree, this);
			hierarchyTree.off("openChanged", this.updateHierarchyTree, this);

			watcher.unwatch(editor3DData, "selectedObject", this.selectedObject3DChanged, this)
		}

		private updateHierarchyTree()
		{
			var nodes = hierarchyTree.getShowNodes();
			this.listData.replaceAll(nodes);
		}

		private selectedObject3DChanged(host: any, property: string, oldvalue: any)
		{
			if (oldvalue instanceof GameObject)
			{
				var newnode = hierarchyTree.getNode(oldvalue);
				if (newnode)
				{
					newnode.selected = false;
				}
				//清除选中效果
				var wireframeComponent = oldvalue.getComponent(WireframeComponent);
				if (wireframeComponent)
					oldvalue.removeComponent(wireframeComponent);
			}
			if (editor3DData.selectedObject && editor3DData.selectedObject instanceof GameObject)
			{
				var newnode = hierarchyTree.getNode(editor3DData.selectedObject);
				if (newnode)
				{
					newnode.selected = true;
					var parentNode = newnode.parent;
					while (parentNode)
					{
						parentNode.isOpen = true;
						parentNode = parentNode.parent;
					}
				}
				//新增选中效果
				var wireframeComponent = editor3DData.selectedObject.getComponent(WireframeComponent);
				if (!wireframeComponent)
					editor3DData.selectedObject.addComponent(WireframeComponent);
			}
		}

		private onAddButtonClick()
		{
			var globalPoint = this.addButton.localToGlobal(0, 0);
			menu.popup(createObjectConfig, globalPoint.x, globalPoint.y);
		}
	}
}