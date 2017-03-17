module feng3d.editor
{
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		public group: eui.Group;
		private view: eui.Component;
		private selectedObject3D: Object3D;
		private watchers: Watcher[] = [];

		public constructor()
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
			this.watchers.push(
				Binding.bindProperty(editor3DData, ["selectedObject3D"], this, "selectedObject3D"),
				Watcher.watch(this, ["selectedObject3D"], this.updateView, this)
			);
		}

		private onRemovedFromStage()
		{
			while (this.watchers.length > 0)
			{
				this.watchers.pop().unwatch();
			}
		}

		private updateView()
		{
			if (this.view && this.view.parent)
			{
				this.view.parent.removeChild(this.view);
			}
			if (this.selectedObject3D)
			{
				this.view = objectview.getObjectView(this.selectedObject3D);
				this.view.percentWidth = 100;
				this.group.addChild(this.view);
			}
		}
	}
}