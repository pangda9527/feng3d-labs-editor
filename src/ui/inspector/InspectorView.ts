module feng3d.editor
{
	/**
     * 巡视界面
     * @author feng     2017-03-20
     */
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		backButton: eui.Button;
		group: eui.Group;

		//
		private view: eui.Component;

		private inspectorViewData: InspectorViewData

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "InspectorViewSkin";
		}

		private onComplete(): void
		{
			this.group.percentWidth = 100;

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		private onAddedToStage()
		{
			this.inspectorViewData = editor3DData.inspectorViewData;
			this.inspectorViewData.on("change", this.onDataChange, this);
			this.backButton.addEventListener(MouseEvent.CLICK, this.onBackClick, this);

			this.backButton.visible = this.inspectorViewData.viewDataList.length > 0;
		}

		private onRemovedFromStage()
		{
			this.inspectorViewData.off("change", this.onDataChange, this);
			this.backButton.removeEventListener(MouseEvent.CLICK, this.onBackClick, this);
			this.inspectorViewData = null;
		}

		private onDataChange()
		{
			this.updateView();
		}

		private updateView()
		{
			this.backButton.visible = this.inspectorViewData.viewDataList.length > 0;
			if (this.view && this.view.parent)
			{
				this.view.parent.removeChild(this.view);
			}
			if (this.inspectorViewData.viewData)
			{
				this.view = objectview.getObjectView(this.inspectorViewData.viewData);
				this.view.percentWidth = 100;
				this.group.addChild(this.view);
			}
		}

		private onBackClick()
		{
			this.inspectorViewData.back();
		}
	}
}