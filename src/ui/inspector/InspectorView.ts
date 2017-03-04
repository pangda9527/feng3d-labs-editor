module feng3d.editor
{
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		public group: eui.Group;
		private view: eui.Component;
		private selectedObject3D: Object3D;
		private inspectorObject3D = new InspectorObject3D();

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);

			Binding.bindProperty(Editor3DData.instance, ["selectedObject3D"], this, "selectedObject3D");
			Binding.bindHandler(this, ["selectedObject3D"], this.updateView, this);

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
				this.inspectorObject3D.setObject3D(this.selectedObject3D);
				this.view = objectview.getObjectView(this.inspectorObject3D);
				this.view.percentWidth = 100;
				this.group.addChild(this.view);
			}
		}
	}
}