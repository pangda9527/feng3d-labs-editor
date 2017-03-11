module feng3d.editor
{
	export class CreateObject3DView extends eui.Component implements eui.UIComponent
	{
		public object3dList: eui.List;
		public maskSprite: eui.Rect;

		private _dataProvider: eui.ArrayCollection;
		private _selectedCallBack: (item: { label: string; }) => void;
		private _isinit = false;

		public constructor()
		{
			super();
			this._dataProvider = new eui.ArrayCollection();

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onComplete, this);
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

		private init()
		{
			this.object3dList.dataProvider = this._dataProvider;
			this.object3dList.addEventListener(egret.Event.CHANGE, this.onObject3dListChange, this);
			this.maskSprite.addEventListener(MouseEvent.CLICK, this.maskMouseDown, this);
			//
			this._isinit = true;
		}

		private onComplete(): void
		{
			this._isinit || this.init();

			if (this.stage)
			{
				var gP = this.localToGlobal(0, 0);
				this.maskSprite.x = -gP.x;
				this.maskSprite.y = -gP.y;
				this.maskSprite.width = this.stage.stageWidth;
				this.maskSprite.height = this.stage.stageHeight;
			}
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