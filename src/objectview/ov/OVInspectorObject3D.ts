module feng3d.editor
{
	export class OVInspectorObject3D extends eui.Component implements IObjectView
	{
		public group: eui.Group;

		private _space: InspectorObject3D;
		public constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = <any>objectViewInfo.owner;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OVInspectorObject3DSkin";
		}

		private onComplete(): void
		{
			this.updateView();
		}

		public get space(): any
		{
			return this._space;
		}

		public set space(value: any)
		{
			this._space = value;
			this.updateView();
		}

		public updateView()
		{
			this.group.removeChildren();
			var components = this._space.components;
			for (var i = 0; i < components.length; i++)
			{
				var component = components[i];
				var accordion = new Accordion();
				accordion.titleName = component.name;
				var displayObject = ObjectView.getObjectView(component.data);
				displayObject.left = displayObject.right = 0;
				accordion.addContent(displayObject);
				accordion.left = accordion.right = 0;
				this.group.addChild(accordion);
			}
		}

		public getAttributeView(attributeName: string): IObjectAttributeView
		{
			return null;
		}

		public getblockView(blockName: string): IObjectBlockView
		{
			return null;
		}
	}
}