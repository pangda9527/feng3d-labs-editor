namespace editor
{
	/**
     * 属性面板（检查器）
     */
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		backButton: eui.Button;
		group: eui.Group;

		//
		private view: eui.Component;

		private viewData: any;
		private viewDataList = [];

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "InspectorViewSkin";
		}

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
			this.backButton.visible = this.viewDataList.length > 0;

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

		updateView()
		{
			this.backButton.visible = this.viewDataList.length > 0;
			if (this.view && this.view.parent)
			{
				this.view.parent.removeChild(this.view);
			}
			if (this.viewData)
			{
				if (this.viewData instanceof AssetsFile)
				{
					var viewData = this.viewData;
					viewData.showInspectorData((showdata) =>
					{
						if (viewData == this.viewData)
						{
							if (this.view && this.view.parent)
							{
								this.view.parent.removeChild(this.view);
							}
							this.updateShowData(showdata);
						}
					});
				} else
				{
					this.updateShowData(this.viewData);
				}
			}
		}

		private updateShowData(showdata: Object)
		{
			if (this.view)
				this.view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
			this.view = feng3d.objectview.getObjectView(showdata);
			this.view.percentWidth = 100;
			this.group.addChild(this.view);
			this.view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
		}

		private dataChanged = false;
		private onValueChanged()
		{
			this.dataChanged = true;
		}

		showData(data: any, removeBack = false)
		{
			if (this.viewData)
			{
				if (this.dataChanged && this.viewData instanceof AssetsFile)
				{
					this.viewData.save(false, () => { });
				}
				this.viewDataList.push(this.viewData);
				this.dataChanged = false;
			}
			if (removeBack)
			{
				this.viewDataList.length = 0;
			}
			//
			this.viewData = data;
			this.updateView();
		}

		onBackButton()
		{
			this.viewData = this.viewDataList.pop();
			this.updateView();
		}
	}
}