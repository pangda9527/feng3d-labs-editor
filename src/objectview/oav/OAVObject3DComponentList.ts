namespace feng3d.editor
{
	@OVAComponent()
	export class OAVObject3DComponentList extends eui.Component implements IObjectAttributeView
	{
		private _space: GameObject;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;
		private accordions: Accordion[] = [];

		//
		group: eui.Group;
		addComponentButton: eui.Button;

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
			this.initView();
		}

		private onAddComponentButtonClick()
		{
			var globalPoint = this.addComponentButton.localToGlobal(0, 0);
			createObject3DView.showView(createObject3DComponentConfig, this.onCreateComponent.bind(this), globalPoint);
		}

		private onCreateComponent(item)
		{
			var cls = ClassUtils.getDefinitionByName(item.className);
			var component = this.space.addComponent(cls);
			this.addComponentView(component);
		}

		get space()
		{
			return this._space;
		}

		set space(value)
		{
			this._space = value;
			this.updateView();
		}

		get attributeName(): string
		{
			return this._attributeName;
		}

		get attributeValue(): Object
		{
			return this._space[this._attributeName];
		}

		set attributeValue(value: Object)
		{
			if (this._space[this._attributeName] != value)
			{
				this._space[this._attributeName] = value;
			}
			this.updateView();
		}

		private initView(): void
		{
			this.accordions.length = 0;
			(<eui.VerticalLayout>this.group.layout).gap = -1;
			var components = <any>this.attributeValue;
			for (var i = 0; i < components.length; i++)
			{
				this.addComponentView(components[i]);
			}
		}

		private addComponentView(component: Component)
		{
			var displayObject: Object3DComponentView = new Object3DComponentView(component);
			displayObject.percentWidth = 100;
			this.group.addChild(displayObject);

			//
			displayObject.deleteButton.addEventListener(MouseEvent.CLICK, this.onDeleteButton, this);
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			for (var i = 0, n = this.group.numChildren; i < n; i++)
			{
				var child = this.group.getChildAt(i)
				if (child instanceof Object3DComponentView)
					child.updateView();
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