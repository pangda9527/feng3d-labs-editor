module feng3d.editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;
		public list: eui.List;

		private createObject3DView: CreateObject3DView;
		private listData: eui.ArrayCollection;

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
			this.addButton.addEventListener(MouseEvent.CLICK, this.onAddButtonClick, this);

			this.listData = this.list.dataProvider = new eui.ArrayCollection();

			editor3DData.hierarchy.rootNode.addEventListener(HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);
			editor3DData.hierarchy.rootNode.addEventListener(HierarchyNode.REMOVED, this.onHierarchyNodeRemoved, this);
			editor3DData.hierarchy.rootNode.addEventListener(HierarchyNode.OPEN_CHANGED, this.onHierarchyNodeRemoved, this);

			Watcher.watch(editor3DData, ["selectedObject3D"], this.selectedObject3DChanged, this);
			this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);
		}

		private onListChange()
		{
			var node: HierarchyNode = this.list.selectedItem;
			editor3DData.selectedObject3D = node.object3D;
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
			var node = editor3DData.hierarchy.getNode(editor3DData.selectedObject3D);
			this.list.selectedIndex = this.listData.getItemIndex(node);
		}

		private onAddButtonClick()
		{
			if (!this.createObject3DView)
			{
				this.createObject3DView = new CreateObject3DView();
			}
			var globalPoint = this.addButton.localToGlobal(0, 0);
			this.createObject3DView.showView(createObjectConfig, this.onCreateObject3d, globalPoint);
		}

		private onCreateObject3d(selectedItem)
		{
			$editorEventDispatcher.dispatchEvent(new Event("Create_Object3D", selectedItem));
		}
	}
}