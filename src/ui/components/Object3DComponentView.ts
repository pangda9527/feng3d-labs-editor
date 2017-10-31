module feng3d.editor
{
	export class Object3DComponentView extends eui.Component
	{
		component: Component;
		componentView: IObjectView;

		//
		accordion: feng3d.editor.Accordion;
		deleteButton: eui.Button;

		/**
		 * 对象界面数据
		 */
		constructor(component: Component)
		{
			super();
			this.component = component;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "Object3DComponentSkin";
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			if (this.componentView)
				this.componentView.updateView();
		}

		private onComplete()
		{
			var componentName = ClassUtils.getQualifiedClassName(this.component).split(".").pop();
			this.accordion.titleName = componentName;
			this.componentView = objectview.getObjectView(this.component);
			this.accordion.addContent(this.componentView);

			this.deleteButton.visible = !(this.component instanceof Transform);

			this.deleteButton.addEventListener(MouseEvent.CLICK, this.onDeleteButton, this);
		}

		private onDeleteButton(event: MouseEvent)
		{
			if (this.component.gameObject)
				this.component.gameObject.removeComponent(this.component);
		}
	}
}