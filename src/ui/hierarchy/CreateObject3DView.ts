module feng3d.editor
{
	export class CreateObject3DView extends eui.Component implements eui.UIComponent
	{
		public object3dList: eui.List;
		public maskSprite: eui.Rect;

		private _dataProvider: eui.ArrayCollection;
		private _selectedCallBack: (item: { label: string; }) => void;

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "CreateObject3DViewSkin";
		}

		public showView(data: { label: string; }[], selectedCallBack: (item: { label: string; }) => void, globalPoint: Point = null)
		{
			this._dataProvider.replaceAll(data.concat());
			this._selectedCallBack = selectedCallBack;
			globalPoint = globalPoint || new Point(input.clientX, input.clientY);
			this.x = globalPoint.x;
			this.y = globalPoint.y;
			editor3DData.stage.addChild(this);
		}

		private onComplete(): void
		{
			this._dataProvider = new eui.ArrayCollection();
			this.object3dList.dataProvider = this._dataProvider;

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			var gP = this.localToGlobal(0, 0);
			this.maskSprite.x = -gP.x;
			this.maskSprite.y = -gP.y;
			this.maskSprite.width = this.stage.stageWidth;
			this.maskSprite.height = this.stage.stageHeight;
			this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
			this.maskSprite.addEventListener(MouseEvent.CLICK, this.maskMouseDown, this);
		}

		private onRemovedFromStage()
		{
			this.object3dList.removeEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
			this.maskSprite.removeEventListener(MouseEvent.CLICK, this.maskMouseDown, this);
		}

		private onObject3dListChange()
		{
			this._selectedCallBack(this.object3dList.selectedItem);
			this.object3dList.selectedIndex = -1;
			this.parent && this.parent.removeChild(this);
		}

		private maskMouseDown()
		{
			this.parent && this.parent.removeChild(this);
		}
	}
}