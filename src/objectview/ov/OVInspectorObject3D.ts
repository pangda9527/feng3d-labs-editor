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
				accordion.addContent(ObjectView.getObjectView(component.data));
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