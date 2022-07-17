namespace editor
{
	/**
     * 属性面板（检查器）
     */
	export class InspectorView extends eui.Component implements ModuleView
	{
		static moduleName = "Inspector";

		public typeLab: eui.Label;
		public backButton: eui.Button;
		public group: eui.Group;
		public emptyLabel: eui.Label;

		moduleName: string;

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "InspectorViewSkin";
			this.moduleName = InspectorView.moduleName;
		}

        /**
         * 历史选中对象列表
         */
		private _historySelectedObject = [];

        /**
         * 最多存储历史选中对象数量
         */
		private _maxHistorySelectedObject = 10;

		get historySelectedObjectLength()
		{
			return this._historySelectedObject.length;
		}

        /**
         * 
         */
		preSelectedObjects()
		{
			this._historySelectedObject.pop();
			var v = this._historySelectedObject.pop();
			editorData.selectedObjects = v;
		}

		private showData(data: any)
		{
			if (this._viewData == data) return;
			if (this._viewData)
			{
				this.saveShowData();
			}

			//
			this._viewData = data;
			this.updateView();
		}

		private onSaveShowData(event: feng3d.Event<() => void>)
		{
			this.saveShowData(event.data);
		}

		private updateView()
		{
			this.typeLab.text = ``;
			this.backButton.visible = this._historySelectedObject.length > 1;
			if (this._view && this._view.parent)
			{
				this._view.parent.removeChild(this._view);
			}
			if (this.emptyLabel.parent)
				this.emptyLabel.parent.removeChild(this.emptyLabel);
			if (this._viewData)
			{
				if (this._viewData instanceof AssetNode)
				{
					if (this._viewData.isDirectory) return;
					if (this._viewData.asset)
					{
						this.updateShowData(this._viewData.asset);
					} else
					{
						if (!this._viewData.isLoaded)
						{
							var viewData = this._viewData;
							viewData.load(() =>
							{
								console.assert(!!viewData.asset);
								if (viewData == this._viewData)
									this.updateShowData(viewData.asset);
							});
						}
					}
				} else
				{
					this.updateShowData(this._viewData);
				}
			} else
			{
				this.group.addChild(this.emptyLabel);
			}
		}

		/**
		 * 保存显示数据
		 */
		private saveShowData(callback?: () => void)
		{
			if (this._dataChanged)
			{
				if (this._viewData.assetId)
				{
					var feng3dAsset = feng3d.rs.getAssetById(this._viewData.assetId);
					if (feng3dAsset)
					{
						editorRS.writeAsset(feng3dAsset, (err) =>
						{
							console.assert(!err, `资源 ${feng3dAsset.assetId} 保存失败！`);
							callback && callback();
						});
					}
				} else if (this._viewData instanceof AssetNode)
				{
					editorAsset.saveAsset(this._viewData);
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
		private _dataChanged = false;

		private onComplete(): void
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			this.backButton.visible = this._historySelectedObject.length > 1;

			this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
			feng3d.globalEmitter.on("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
			//
			feng3d.globalEmitter.on("inspector.update", this.updateView, this);
			feng3d.globalEmitter.on("inspector.saveShowData", this.onSaveShowData, this);

			//
			this.updateView();
		}

		private onRemovedFromStage()
		{
			this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
			feng3d.globalEmitter.off("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
			//
			feng3d.globalEmitter.off("inspector.update", this.updateView, this);
			feng3d.globalEmitter.off("inspector.saveShowData", this.onSaveShowData, this);
		}

		private onSelectedObjectsChanged()
		{
			this._historySelectedObject.push(editorData.selectedObjects);
			if (this._historySelectedObject.length > this._maxHistorySelectedObject) this._historySelectedObject.shift();

			var data = inspectorMultiObject.convertInspectorObject(editorData.selectedObjects);
			this.showData(data);
		}

		private updateShowData(showdata: Object)
		{
			this.typeLab.text = `${showdata.constructor["name"]}`;
			if (this._view)
				this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
			var editable = true;
			if (showdata instanceof feng3d.Feng3dObject) editable = !Boolean(showdata.hideFlags & feng3d.HideFlags.NotEditable);
			this._view = feng3d.objectview.getObjectView(showdata, { editable: editable });
			// this._view.percentWidth = 100;
			this.group.addChild(this._view);
			this.group.scrollV = 0;
			this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
		}

		private onValueChanged(e: feng3d.ObjectViewEvent)
		{
			this._dataChanged = true;
			if (this._viewData instanceof feng3d.FileAsset)
			{
				if (this._viewData.assetId)
				{
					var assetNode = editorAsset.getAssetByID(this._viewData.assetId);
					assetNode && assetNode.updateImage();
				}
			} else if (this._viewData instanceof AssetNode)
			{
				this._viewData.updateImage();
			}
		}

		private onBackButton()
		{
			this.preSelectedObjects();
		}
	}

	Modules.moduleViewCls[InspectorView.moduleName] = InspectorView;
}