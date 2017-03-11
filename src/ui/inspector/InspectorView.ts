module feng3d.editor
{
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		public group: eui.Group;
		private view: eui.Component;
		private selectedObject3D: Object3D;

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);

			Binding.bindProperty(editor3DData, ["selectedObject3D"], this, "selectedObject3D");
			Watcher.watch(this, ["selectedObject3D"], this.updateView, this);

			this.skinName = "InspectorViewSkin";
		}

		private onComplete(): void
		{
			this.group.percentWidth = 100;
			// this.group.addChild(objectview.getObjectView(new ObjectA()));
			// this.group.addChild(objectview.getObjectView(new egret.Sprite()));
			// this.group.addChild(objectview.getObjectView(new Transform(1, 2, 3, 4, 5, 6)));
			// this.group.addChild(objectview.getObjectView({
			// 	vector3D: new Vector3D(1, 2, 3),
			// 	transform: new Transform(1, 2, 3, 4, 5, 6)
			// }));
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