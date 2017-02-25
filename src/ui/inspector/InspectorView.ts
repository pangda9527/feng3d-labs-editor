module feng3d.editor
{
	export class InspectorView extends eui.Component implements eui.UIComponent
	{
		public static Inspector_Object = "inspectorObject";
		public group: eui.Group;
		private objectView: eui.Component;

		public constructor()
		{
			super();
			$editorEventDispatcher.addEventListener(InspectorView.Inspector_Object, this.onInspectorObject, this);
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "InspectorViewSkin";
		}

		private onComplete(): void
		{

			// this.group.addChild(ObjectView.getObjectView(new ObjectA()));
			// this.group.addChild(ObjectView.getObjectView(new egret.Sprite()));

			// this.group.addChild(ObjectView.getObjectView({
			// 	vector3D: new Vector3D(1, 2, 3),
			// 	transform: new Transform(1, 2, 3, 4, 5, 6)
			// }));
		}

		private onInspectorObject(event: Event)
		{
			if (this.objectView && this.objectView.parent)
			{
				this.objectView.parent.removeChild(this.objectView);
			}
			if (event.data)
			{
				this.objectView = ObjectView.getObjectView(event.data);
				this.group.addChild(this.objectView);
			}
		}
	}
}