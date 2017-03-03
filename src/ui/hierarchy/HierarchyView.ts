module feng3d.editor
{
	export class HierarchyView extends eui.Component implements eui.UIComponent
	{
		public addButton: eui.Button;

		private createObject3DView: CreateObject3DView;

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "HierarchyViewSkin";
		}

		private onComplete(): void
		{
			this.addButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddButtonClick, this);
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