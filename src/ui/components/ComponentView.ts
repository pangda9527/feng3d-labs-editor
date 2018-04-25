namespace feng3d.editor
{
	export class ComponentView extends eui.Component
	{
		component: Component;
		componentView: IObjectView;

		//
		accordion: feng3d.editor.Accordion;
		deleteButton: eui.Button;

		script: Script;
		scriptView: IObjectView & eui.Component

		/**
		 * 对象界面数据
		 */
		constructor(component: Component)
		{
			super();
			this.component = component;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "ComponentSkin";
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

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
				this.onAddToStage();
		}

		private onDeleteButton(event: egret.MouseEvent)
		{
			if (this.component.gameObject)
				this.component.gameObject.removeComponent(this.component);
		}

		private onAddToStage()
		{
			this.initScriptView();
			this.updateView();

			this.deleteButton.addEventListener(egret.MouseEvent.CLICK, this.onDeleteButton, this);
			if (this.scriptView)
				this.scriptView.addEventListener(ObjectViewEvent.VALUE_CHANGE, this.saveScriptData, this);
		}

		private onRemovedFromStage()
		{
			this.saveScriptData();

			this.deleteButton.removeEventListener(egret.MouseEvent.CLICK, this.onDeleteButton, this);
			if (this.scriptView)
				this.scriptView.removeEventListener(ObjectViewEvent.VALUE_CHANGE, this.saveScriptData, this);
		}

		private initScriptView()
		{
			// 初始化Script属性面板
			if (this.component instanceof ScriptComponent)
			{
				var component = this.component;
				ScriptComponent.addScript(component.url, (scriptClass) =>
				{
					this.script = new scriptClass();
					var scriptData = component.scriptData = component.scriptData || {};
					for (const key in scriptData)
					{
						if (scriptData.hasOwnProperty(key))
						{
							this.script[key] = scriptData[key];
						}
					}
					this.scriptView = objectview.getObjectView(this.script, false);
					this.accordion.addContent(this.scriptView);
				});
			}
		}

		private saveScriptData()
		{
			//保存脚本数据
			if (this.script)
			{
				var component: ScriptComponent = <ScriptComponent>this.component;
				var scriptData = component.scriptData || {};
				var objectAttributeInfos = objectview.getObjectInfo(this.script, false).objectAttributeInfos;
				for (let i = 0; i < objectAttributeInfos.length; i++)
				{
					const element = objectAttributeInfos[i];
					scriptData[element.name] = this.script[element.name];
				}
				component.scriptData = scriptData;
			}
		}
	}
}