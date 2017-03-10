module feng3d.editor
{
	export class OAVObject3DComponent extends eui.Component implements IObjectAttributeView
	{
		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;

		public group: eui.Group;
		private accordions: Accordion[] = [];

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OAVObject3DComponentSkin";
		}
		private onComplete()
		{
			this.updateView();
		}

		public get space(): Object
		{
			return this._space;
		}

		public set space(value: Object)
		{
			this._space = value;
			this.updateView();
		}

		public get attributeName(): string
		{
			return this._attributeName;
		}

		public get attributeValue(): Object
		{
			return this._space[this._attributeName];
		}

		public set attributeValue(value: Object)
		{
			if (this._space[this._attributeName] != value)
			{
				this._space[this._attributeName] = value;
			}
			this.updateView();
		}

		/**
		 * 更新界面
		 */
		public updateView(): void
		{
			this.accordions.length = 0;
			(<eui.VerticalLayout>this.group.layout).gap = -1;
			this.group.removeChildren();

			var components = <any>this.attributeValue;
			for (var i = 0; i < components.length; i++)
			{
				var component = components[i];
				var componentName = ClassUtils.getQualifiedClassName(component).split(".").pop();
				var accordion = new Accordion();
				accordion.titleName = componentName;
				var displayObject: eui.Component = objectview.getObjectView(component);
				displayObject.percentWidth = 100;
				accordion.addContent(displayObject);
				accordion.percentWidth = 100;
				this.group.addChild(accordion);
				this.accordions.push(accordion);
			}
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