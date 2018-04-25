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

		/**
		 * 对象界面数据
		 */
		constructor(component: Component)
		{
			super();
			this.component = component;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "ComponentSkin";

			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
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

			this.deleteButton.addEventListener(egret.MouseEvent.CLICK, this.onDeleteButton, this);

			this.initScriptView();
		}

		private onDeleteButton(event: egret.MouseEvent)
		{
			if (this.component.gameObject)
				this.component.gameObject.removeComponent(this.component);
		}

		private onRemovedFromStage()
		{
			this.saveScriptData();
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
					var scriptView: IObjectView & eui.Component = objectview.getObjectView(this.script, false);
					this.accordion.addContent(scriptView);
					scriptView.addEventListener(ObjectViewEvent.VALUE_CHANGE, this.saveScriptData, this);
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