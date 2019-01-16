namespace editor
{
	/**
     * 属性面板（检查器）
     */
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		public typeLab: eui.Label;
		public backButton: eui.Button;
		public group: eui.Group;

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
			this._viewData = data;
			this.updateView();
		}

		updateView()
		{
			this.typeLab.text = `Inspector`;
			this.backButton.visible = this._viewDataList.length > 0;
			if (this._view && this._view.parent)
			{
				this._view.parent.removeChild(this._view);
			}
			if (this._viewData)
			{
				if (this._viewData instanceof AssetsFile)
				{
					if (this._viewData.isDirectory) return;
					if (this._viewData.feng3dAssets)
					{
						this.updateShowData(this._viewData.feng3dAssets);
					} else
					{
						if (!this._viewData.isLoaded)
						{
							var viewData = this._viewData;
							viewData.load(() =>
							{
								feng3d.assert(!!viewData.feng3dAssets);
								if (viewData == this._viewData)
									this.updateShowData(viewData.feng3dAssets);
							});
						}
					}
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
			if (this._dataChanged)
			{
				if (this._viewData instanceof feng3d.Feng3dAssets)
				{
					if (this._viewData.assetsId)
					{
						var assetsFile = editorAssets.getAssetsByID(this._viewData.assetsId);
						assetsFile && editorAssets.saveAssets(assetsFile);
					}
				} else if (this._viewData instanceof AssetsFile)
				{
					editorAssets.saveAssets(assetsFile);
				}

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
			var data = inspectorMultiObject.convertInspectorObject(editorData.selectedObjects);
			this.showData(data, true);
		}

		private updateShowData(showdata: Object)
		{
			this.typeLab.text = `Inspector - ${showdata.constructor["name"]}`;
			if (this._view)
				this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
			var editable = true;
			if (showdata instanceof feng3d.Feng3dObject) editable = !Boolean(showdata.hideFlags & feng3d.HideFlags.NotEditable);
			this._view = feng3d.objectview.getObjectView(showdata, { editable: editable });
			this._view.percentWidth = 100;
			this.group.addChild(this._view);
			this.group.scrollV = 0;
			this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
		}

		private onValueChanged(e: feng3d.ObjectViewEvent)
		{
			this._dataChanged = true;
			if (this._viewData instanceof feng3d.Feng3dAssets)
			{
				if (this._viewData.assetsId)
				{
					var assetsFile = editorAssets.getAssetsByID(this._viewData.assetsId);
					assetsFile && assetsFile.updateImage();
				}
			} else if (this._viewData instanceof AssetsFile)
			{
				this._viewData.updateImage();
			}
		}

		private onBackButton()
		{
			this._viewData = this._viewDataList.pop();
			this.updateView();
		}
	}
}