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
			this.addEventListener(eui.UIEvent.RESIZE, this.onResize, this);
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

		private accordions: Accordion[] = [];

		public updateView()
		{
			// this.accordions.length = 0;
			// this.group.removeChildren();
			// var components = this._space.inspectorObject3DComponent;
			// for (var i = 0; i < components.length; i++)
			// {
			// 	var component = components[i];
			// 	var accordion = new Accordion();
			// 	accordion.titleName = component.name;
			// 	var displayObject: eui.Component = ObjectView.getObjectView(component.data);
			// 	displayObject.percentWidth = 100;
			// 	accordion.addContent(displayObject);
			// 	accordion.percentWidth = 100;
			// 	this.group.addChild(accordion);
			// 	this.accordions.push(accordion);
			// }
		}

		public getAttributeView(attributeName: string): IObjectAttributeView
		{
			return null;
		}

		public getblockView(blockName: string): IObjectBlockView
		{
			return null;
		}

		private onResize()
		{
			for (var i = 0; i < this.accordions.length; i++)
			{
				this.accordions[i].width = this.width;
			}
		}
	}
}