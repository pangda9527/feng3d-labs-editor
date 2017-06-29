module feng3d.editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;
		public list: eui.List;

		private listData: eui.ArrayCollection;

		private watchers: Watcher[] = [];

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

			Event.on(editor3DData.hierarchy.rootNode, <any>HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);
			Event.on(editor3DData.hierarchy.rootNode, <any>HierarchyNode.REMOVED, this.onHierarchyNodeRemoved, this);
			Event.on(editor3DData.hierarchy.rootNode, <any>HierarchyNode.OPEN_CHANGED, this.onHierarchyNodeRemoved, this);
			this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);

			this.watchers.push(
				Watcher.watch(editor3DData, ["selectedObject3D"], this.selectedObject3DChanged, this)
			);
		}

		private onRemovedFromStage()
		{
			this.addButton.removeEventListener(MouseEvent.CLICK, this.onAddButtonClick, this);

			Event.off(editor3DData.hierarchy.rootNode, <any>HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);
			Event.off(editor3DData.hierarchy.rootNode, <any>HierarchyNode.REMOVED, this.onHierarchyNodeRemoved, this);
			Event.off(editor3DData.hierarchy.rootNode, <any>HierarchyNode.OPEN_CHANGED, this.onHierarchyNodeRemoved, this);
			this.list.removeEventListener(egret.Event.CHANGE, this.onListChange, this);

			while (this.watchers.length > 0)
			{
				this.watchers.pop().unwatch();
			}
		}

		private onListChange()
		{
			var node: HierarchyNode = this.list.selectedItem;
			editor3DData.selectedObject3D = node.object3D.gameObject;
		}

		private onHierarchyNodeAdded(event: Event)
		{
			var nodes = editor3DData.hierarchy.rootNode.getShowNodes();
			this.listData.replaceAll(nodes);
		}

		private onHierarchyNodeRemoved(event: Event)
		{
			var nodes = editor3DData.hierarchy.rootNode.getShowNodes();
			this.listData.replaceAll(nodes);
			this.list.selectedItem = editor3DData.hierarchy.selectedNode;
		}

		private selectedObject3DChanged()
		{
			var node = editor3DData.hierarchy.getNode(editor3DData.selectedObject3D ? editor3DData.selectedObject3D.transform : null);
			this.list.selectedIndex = this.listData.getItemIndex(node);
		}

		private onAddButtonClick()
		{
			var globalPoint = this.addButton.localToGlobal(0, 0);
			createObject3DView.showView(createObjectConfig, this.onCreateObject3d, globalPoint);
		}

		private onCreateObject3d(selectedItem)
		{
			Event.dispatch($editorEventDispatcher, <any>"Create_Object3D", selectedItem);
		}
	}
}