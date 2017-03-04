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
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
			this.addButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddButtonClick, this);

			this.listData = this.list.dataProvider = new eui.ArrayCollection();

			editor3DData.hierarchy.rootNode.addEventListener(HierarchyNode.ADDED, this.onHierarchyNodeAdded, this);

			// Binding.bindHandler(editor3DData, ["selectedObject3D"], this.selectedObject3DChanged, this)
			// this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);
		}

		private onListChange()
		{
			this.list.selectedItem
		}

		private onHierarchyNodeAdded(event: Event)
		{
			var hierarchyNode: HierarchyNode = event.data;
			this.listData.addItem(hierarchyNode);
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
			this.createObject3DView.x = globalPoint.x;
			this.createObject3DView.y = globalPoint.y;
			this.stage.addChild(this.createObject3DView);
		}
	}
}