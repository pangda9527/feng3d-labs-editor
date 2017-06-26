module feng3d.editor
{
	export class Object3DComponentView extends eui.Component
	{
		public component: Component;

		//
		public accordion: feng3d.editor.Accordion;
		public deleteButton: eui.Button;

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

		private onComplete()
		{
			var componentName = ClassUtils.getQualifiedClassName(this.component).split(".").pop();
			this.accordion.titleName = componentName;
			var displayObject: eui.Component = objectview.getObjectView(this.component);
			this.accordion.addContent(displayObject);
		}
	}
}