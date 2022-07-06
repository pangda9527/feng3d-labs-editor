namespace editor
{
	export class ParticleComponentView extends eui.Component
	{
		component: feng3d.ParticleModule;
		componentView: feng3d.IObjectView;

		//
		public accordion: editor.Accordion;

		//
		public enabledCB: eui.CheckBox;

		/**
		 * 对象界面数据
		 */
		constructor(component: feng3d.ParticleModule)
		{
			super();
			this.component = component;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "ParticleComponentView";
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.updateEnableCB();
			if (this.componentView)
				this.componentView.updateView();
		}

		private onComplete()
		{
			var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
			this.accordion.titleName = componentName;
			this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
			this.accordion.addContent(this.componentView);

			this.enabledCB = this.accordion["enabledCB"];

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
				this.onAddToStage();
		}

		private onAddToStage()
		{
			this.updateView();

			this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
		}

		private onRemovedFromStage()
		{
			this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
		}

		private updateEnableCB()
		{
			this.enabledCB.selected = this.component.enabled;
		}

		private onEnableCBChange()
		{
			this.component.enabled = this.enabledCB.selected;
		}
	}
}