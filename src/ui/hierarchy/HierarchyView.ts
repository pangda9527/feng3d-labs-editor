module feng3d.editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;
		public object3dList: eui.List;

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
			this.addButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddButtonClick, this);
			this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);

		}

		private onAddButtonClick()
		{
			if (this.object3dList.parent)
			{
				this.object3dList.parent.removeChild(this.object3dList);
			} else
			{
				this.addChild(this.object3dList);
			}
		}

		private onObject3dListChange()
		{
			var name = this.object3dList.selectedItem.label;
			$editorEventDispatcher.dispatchEvent(new Event("Create_Object3D", name));
		}
	}
}