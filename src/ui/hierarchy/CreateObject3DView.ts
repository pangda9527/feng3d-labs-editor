module feng3d.editor
{
	export class CreateObject3DView extends eui.Component implements eui.UIComponent
	{

		public object3dList: eui.List;
		private maskSprite: egret.Sprite;

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
				this.maskSprite = new egret.Sprite();
				this.maskSprite.graphics.beginFill(0, 0);
				this.maskSprite.graphics.drawRect(0, 0, 100, 100);
				this.maskSprite.graphics.endFill();
				this.addChildAt(this.maskSprite, 0);
				this.maskSprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.maskMouseDown, this);
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