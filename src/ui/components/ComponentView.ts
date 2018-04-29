namespace feng3d.editor
{
	export class ComponentView extends eui.Component
	{
		component: Component;
		componentView: IObjectView;

		//
		public accordion: feng3d.editor.Accordion;
		public deleteButton: eui.Button;

		//
		public enabledCB: eui.CheckBox;
		public componentIcon: eui.Image;
		public helpBtn: eui.Button;
		public operationBtn: eui.Button;


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
			this.updateEnableCB();
			if (this.componentView)
				this.componentView.updateView();
		}

		private onComplete()
		{
			var componentName = ClassUtils.getQualifiedClassName(this.component).split(".").pop();
			this.accordion.titleName = componentName;
			this.componentView = objectview.getObjectView(this.component, false, ["enabled"]);
			this.accordion.addContent(this.componentView);
			this.deleteButton.visible = !(this.component instanceof Transform);

			this.enabledCB = this.accordion["enabledCB"];
			this.componentIcon = this.accordion["componentIcon"];
			this.helpBtn = this.accordion["helpBtn"];
			this.operationBtn = this.accordion["operationBtn"];

			if (this.component instanceof Transform)
			{
				this.componentIcon.source = "Transform_png";
			} else if (this.component instanceof MeshRenderer)
			{
				this.componentIcon.source = "MeshRenderer_png";
			} else if (this.component instanceof ScriptComponent)
			{
				this.componentIcon.source = "ScriptComponent_png";
			}

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

			this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			if (this.component instanceof feng3d.Behaviour)
				feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);

			this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
			this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
		}

		private onRemovedFromStage()
		{
			this.saveScriptData();

			this.deleteButton.removeEventListener(egret.MouseEvent.CLICK, this.onDeleteButton, this);
			if (this.scriptView)
				this.scriptView.removeEventListener(ObjectViewEvent.VALUE_CHANGE, this.saveScriptData, this);

			this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			if (this.component instanceof feng3d.Behaviour)
				feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);

			this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
			this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
		}

		private updateEnableCB()
		{
			if (this.component instanceof feng3d.Behaviour)
			{
				this.enabledCB.selected = this.component.enabled;
				this.enabledCB.visible = true;
			}
			else
			{
				this.enabledCB.visible = false;
			}
		}

		private onEnableCBChange()
		{
			if (this.component instanceof feng3d.Behaviour)
			{
				this.component.enabled = this.enabledCB.selected;
			}
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

		private onOperationBtnClick()
		{

		}

		private onHelpBtnClick()
		{
			window.open(`http://feng3d.gitee.io/#/script`);
		}
	}
}