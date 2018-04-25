namespace feng3d.editor
{
	@OAVComponent()
	export class OAVComponentList extends eui.Component implements IObjectAttributeView
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
			this.skinName = "OAVComponentListSkin";
		}

		private onComplete()
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
				this.onAddToStage();
		}

		private onAddToStage()
		{
			this.initView();
			this.updateView();

			this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
		}

		private onRemovedFromStage()
		{
			this.disposeView();

			this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
		}

		private onAddComponentButtonClick()
		{
			var globalPoint = this.addComponentButton.localToGlobal(0, 0);
			needcreateComponentGameObject = this.space;
			menu.popup(createComponentConfig, globalPoint.x, globalPoint.y, 180);
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
			this.space.on("addedComponent", this.onaddedcompont, this);
			this.space.on("removedComponent", this.onremovedComponent, this);

			drag.register(this.addComponentButton, null, ["file_script"], (dragdata) =>
			{
				if (dragdata.file_script)
				{
					this.space.addComponent(ScriptComponent).url = dragdata.file_script;
				}
			});
		}

		private disposeView()
		{
			var components = <any>this.attributeValue;
			for (var i = 0; i < components.length; i++)
			{
				this.removedComponentView(components[i]);
			}

			this.space.off("addedComponent", this.onaddedcompont, this);
			this.space.off("removedComponent", this.onremovedComponent, this);

			drag.unregister(this.addComponentButton);
		}

		private addComponentView(component: Component)
		{
			var o: Object;
			if (!component.showInInspector)
				return;

			var displayObject = new ComponentView(component);
			displayObject.percentWidth = 100;
			this.group.addChild(displayObject);
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			for (var i = 0, n = this.group.numChildren; i < n; i++)
			{
				var child = this.group.getChildAt(i)
				if (child instanceof ComponentView)
					child.updateView();
			}
		}

		private removedComponentView(component: Component)
		{
			for (var i = this.group.numChildren - 1; i >= 0; i--)
			{
				var displayObject = this.group.getChildAt(i);
				if (displayObject instanceof ComponentView && displayObject.component == component)
				{
					this.group.removeChild(displayObject);
				}
			}
		}

		private onaddedcompont(event: Event<Component>)
		{
			this.addComponentView(event.data);
		}

		private onremovedComponent(event: Event<Component>)
		{
			this.removedComponentView(event.data);
		}
	}
}