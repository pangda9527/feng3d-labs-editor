module feng3d.editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;
		public list: eui.List;

		private listData: eui.ArrayCollection;

		private watchers: eui.Watcher[] = [];

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
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

			editor3DData.hierarchy.rootNode.on("added", this.onHierarchyNodeAdded, this);
			editor3DData.hierarchy.rootNode.on("removed", this.onHierarchyNodeRemoved, this);
			editor3DData.hierarchy.rootNode.on("openChanged", this.onHierarchyNodeRemoved, this);
			this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);

			this.watchers.push(
				eui.Watcher.watch(editor3DData, ["selectedObject"], this.selectedObject3DChanged, this)
			);
		}

		private onRemovedFromStage()
		{
			this.addButton.removeEventListener(MouseEvent.CLICK, this.onAddButtonClick, this);

			editor3DData.hierarchy.rootNode.off("added", this.onHierarchyNodeAdded, this);
			editor3DData.hierarchy.rootNode.off("removed", this.onHierarchyNodeRemoved, this);
			editor3DData.hierarchy.rootNode.off("openChanged", this.onHierarchyNodeRemoved, this);
			this.list.removeEventListener(egret.Event.CHANGE, this.onListChange, this);

			while (this.watchers.length > 0)
			{
				this.watchers.pop().unwatch();
			}
		}

		private onListChange()
		{
			var node: HierarchyNode = this.list.selectedItem;
			editor3DData.selectedObject = node.object3D;
		}

		private onHierarchyNodeAdded()
		{
			var nodes = editor3DData.hierarchy.rootNode.getShowNodes();
			this.listData.replaceAll(nodes);
		}

		private onHierarchyNodeRemoved()
		{
			var nodes = editor3DData.hierarchy.rootNode.getShowNodes();
			this.listData.replaceAll(nodes);
			this.list.selectedItem = editor3DData.hierarchy.selectedNode;
		}

		private selectedObject3DChanged()
		{
			var node = editor3DData.hierarchy.getNode(editor3DData.selectedObject ? editor3DData.selectedObject : null);
			this.list.selectedIndex = this.listData.getItemIndex(node);
		}

		private onAddButtonClick()
		{
			var globalPoint = this.addButton.localToGlobal(0, 0);
			createObject3DView.showView(createObjectConfig, this.onCreateObject3d, globalPoint);
		}

		private onCreateObject3d(selectedItem)
		{
			$editorEventDispatcher.dispatch("Create_Object3D", selectedItem);
		}
	}
}