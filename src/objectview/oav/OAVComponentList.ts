namespace editor
{
	@feng3d.OAVComponent()
	export class OAVComponentList extends OAVBase
	{
		protected _space: feng3d.GameObject;

		//
		group: eui.Group;
		addComponentButton: eui.Button;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "OAVComponentListSkin";
		}

		private onAddComponentButtonClick()
		{
			menu.popup(menuConfig.getCreateComponentMenu(this.space));
		}

		get space()
		{
			return this._space;
		}

		set space(value)
		{
			this._space = value;
			this.dispose();
			this.initView();
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

		initView(): void
		{
			(<eui.VerticalLayout>this.group.layout).gap = -1;

			var components = <any>this.attributeValue;
			for (var i = 0; i < components.length; i++)
			{
				this.addComponentView(components[i]);
			}
			this.space.on("addComponent", this.onAddCompont, this);
			this.space.on("removeComponent", this.onRemoveComponent, this);

			drag.register(this.addComponentButton, null, ["file_script"], (dragdata) =>
			{
				dragdata.getDragData("file_script").forEach(v =>
				{
					this.space.addScript(v.scriptName);
				});
			});

			this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
		}

		dispose()
		{
			var components = <any>this.attributeValue;
			for (var i = 0; i < components.length; i++)
			{
				this.removedComponentView(components[i]);
			}

			this.space.off("addComponent", this.onAddCompont, this);
			this.space.off("removeComponent", this.onRemoveComponent, this);

			drag.unregister(this.addComponentButton);

			this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
		}

		private addComponentView(component: feng3d.Components)
		{
			if (component.hideFlags & feng3d.HideFlags.HideInInspector)
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

		private removedComponentView(component: feng3d.Components)
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

		private onAddCompont(event: feng3d.Event<{ gameobject: feng3d.GameObject; component: feng3d.Component; }>)
		{
			if (event.data.component.gameObject == this.space)
				this.addComponentView(event.data.component);
		}

		private onRemoveComponent(event: feng3d.Event<{ gameobject: feng3d.GameObject; component: feng3d.Component; }>)
		{
			if (event.data.component.gameObject == this.space)
				this.removedComponentView(event.data.component);
		}
	}
}