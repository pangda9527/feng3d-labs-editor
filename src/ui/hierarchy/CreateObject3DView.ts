module feng3d.editor
{
	export class CreateObject3DView extends eui.Component implements eui.UIComponent
	{

		public object3dList: eui.List;
		private maskSprite: eui.Rect;

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "CreateObject3DViewSkin";
		}
		private onComplete(): void
		{
			this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		}

		private onObject3dListChange()
		{
			var name = this.object3dList.selectedItem.label;
			$editorEventDispatcher.dispatchEvent(new Event("Create_Object3D", name));
			this.parent && this.parent.removeChild(this);
		}

		private onAddedToStage()
		{
			if (!this.maskSprite)
			{
				this.maskSprite = new eui.Rect(100, 100, 0);
				this.maskSprite.alpha = 0;
				this.addChildAt(this.maskSprite, 0);
				this.maskSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.maskMouseDown, this);
			}
			var gP = this.localToGlobal(0, 0);
			this.maskSprite.x = -gP.x;
			this.maskSprite.y = -gP.y;
			this.maskSprite.width = this.stage.stageWidth;
			this.maskSprite.height = this.stage.stageHeight;
		}

		private maskMouseDown()
		{
			this.parent && this.parent.removeChild(this);
		}
	}
}