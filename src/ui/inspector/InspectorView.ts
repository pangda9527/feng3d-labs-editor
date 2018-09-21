namespace editor
{
	/**
     * 属性面板（检查器）
     */
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		backButton: eui.Button;
		group: eui.Group;

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "InspectorViewSkin";
		}

		showData(data: any, removeBack = false)
		{
			if (this._viewData)
			{
				this.saveShowData();
				this._viewDataList.push(this._viewData);
			}
			if (removeBack)
			{
				this._viewDataList.length = 0;
			}
			//
			this._viewData = null;
			if (data instanceof AssetsFile)
			{
				this._viewData = data.feng3dAssets;
				this.updateView();
			} else
			{
				this._viewData = data;
				this.updateView();
			}
		}

		updateView()
		{
			this.backButton.visible = this._viewDataList.length > 0;
			if (this._view && this._view.parent)
			{
				this._view.parent.removeChild(this._view);
			}
			if (this._viewData)
			{
				if (this._viewData instanceof AssetsFile)
				{
					this.updateShowData(this._viewData.feng3dAssets);
				} else
				{
					this.updateShowData(this._viewData);
				}
			}
		}

		/**
		 * 保存显示数据
		 */
		saveShowData(callback?: () => void)
		{
			if (this._dataChanged && this._viewData instanceof feng3d.Feng3dAssets)
			{
				assets.writeAssets(this._viewData, callback);
				this._dataChanged = false;
			} else
			{
				callback && callback();
			}
		}

		//
		private _view: eui.Component;
		private _viewData: any;
		private _viewDataList = [];
		private _dataChanged = false;

		private onComplete(): void
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			editorui.inspectorView = this;

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			this.backButton.visible = this._viewDataList.length > 0;

			this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
			feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
		}

		private onRemovedFromStage()
		{
			this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
			feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
		}

		private onSelectedObjectsChanged()
		{
			var selectedObjects = editorData.selectedObjects;
			if (selectedObjects && selectedObjects.length > 0)
				this.showData(selectedObjects[0], true)
			else
				this.showData(null, true)
		}

		private updateShowData(showdata: Object)
		{
			if (this._view)
				this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
			this._view = feng3d.objectview.getObjectView(showdata);
			this._view.percentWidth = 100;
			this.group.addChild(this._view);
			this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
		}

		private onValueChanged()
		{
			this._dataChanged = true;
		}

		private onBackButton()
		{
			this._viewData = this._viewDataList.pop();
			this.updateView();
		}
	}
}