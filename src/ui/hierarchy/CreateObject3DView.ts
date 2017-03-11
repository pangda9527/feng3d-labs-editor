module feng3d.editor
{
	export class CreateObject3DView extends eui.Component implements eui.UIComponent
	{

		public object3dList: eui.List;
		private maskSprite: eui.Rect;

		private dataProvider: eui.ArrayCollection;
		private selectedCallBack: (item: { label: string; }) => void;

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "CreateObject3DViewSkin";
		}

		public showView(data: { label: string; }[], selectedCallBack: (item: { label: string; }) => void, globalPoint: Point = null)
		{
			if (this.dataProvider.source != data)
			{
				this.dataProvider.replaceAll(data);
			}
			this.selectedCallBack = selectedCallBack;
			globalPoint = globalPoint || new Point(input.clientX, input.clientY);
			this.x = globalPoint.x;
			this.y = globalPoint.y;
			editor3DData.stage.addChild(this);
		}

		private onComplete(): void
		{
			this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);

			this.dataProvider = this.object3dList.dataProvider = new eui.ArrayCollection();
		}

		private onObject3dListChange()
		{
			this.selectedCallBack(this.object3dList.selectedItem);
			this.object3dList.selectedIndex = -1;
			this.parent && this.parent.removeChild(this);
		}

		private onAddedToStage()
		{
			if (!this.maskSprite)
			{
				this.maskSprite = new eui.Rect(100, 100, 0);
				this.maskSprite.alpha = 0;
				this.addChildAt(this.maskSprite, 0);
				this.maskSprite.addEventListener(MouseEvent.CLICK, this.maskMouseDown, this);
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