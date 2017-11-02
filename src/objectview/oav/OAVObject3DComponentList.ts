module feng3d.editor
{
	@OAVComponent()
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
			needcreateComponentGameObject = this.space;
			menu.popup(createObject3DComponentConfig, globalPoint.x, globalPoint.y, 180);
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
					GameObjectUtil.addScript(this.space, dragdata.file_script.replace(/\.ts\b/, ".js"));
				}
			});
		}

		private addComponentView(component: Component)
		{
			if (component instanceof Transform)
			{
				//隐藏拥有以下组件的Transform组件
				if (
					this.space.getComponent(Scene3D)
					|| this.space.getComponent(Trident)
					|| this.space.getComponent(GroundGrid)
					// || this.space.getComponent(SkinnedMeshRenderer)
				)
					return;
			}
			if (component instanceof BoundingComponent)
				return;
			if (component instanceof RenderAtomicComponent)
				return;
			if (component instanceof WireframeComponent)
				return;

			var displayObject = new Object3DComponentView(component);
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
				if (child instanceof Object3DComponentView)
					child.updateView();
			}
		}

		private removedComponentView(component: Component)
		{
			for (var i = this.group.numChildren - 1; i >= 0; i--)
			{
				var displayObject = this.group.getChildAt(i);
				if (displayObject instanceof Object3DComponentView && displayObject.component == component)
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