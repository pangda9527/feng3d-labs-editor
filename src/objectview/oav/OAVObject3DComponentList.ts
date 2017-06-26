module feng3d.editor
{
	export class OAVObject3DComponentList extends eui.Component implements IObjectAttributeView
	{
		private _space: GameObject;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;
		private accordions: Accordion[] = [];

		//
		public group: eui.Group;
		public addComponentButton: eui.Button;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = <GameObject>attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OAVObject3DComponentListSkin";
		}

		private onComplete()
		{
			this.addComponentButton.addEventListener(MouseEvent.CLICK, this.onAddComponentButtonClick, this);
			this.updateView();
		}

		private onAddComponentButtonClick()
		{
			var globalPoint = this.addComponentButton.localToGlobal(0, 0);
			createObject3DView.showView(createObject3DComponentConfig, this.onCreateComponent.bind(this), globalPoint);
		}

		private onCreateComponent(item)
		{
			var cls = ClassUtils.getDefinitionByName(item.className);
			this.space.addComponent(cls);

			this.updateView();
		}

		public get space()
		{
			return this._space;
		}

		public set space(value)
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

				var displayObject: Object3DComponentView = new Object3DComponentView(component);
				displayObject.percentWidth = 100;
				this.group.addChild(displayObject);

				//
				displayObject.deleteButton.addEventListener(MouseEvent.CLICK, this.onDeleteButton, this);
			}
		}

		private onDeleteButton(event: MouseEvent)
		{
			var displayObject: Object3DComponentView = event.currentTarget.parent;
			this.group.removeChild(displayObject);
			this.space.removeComponent(displayObject.component);
		}
	}
}