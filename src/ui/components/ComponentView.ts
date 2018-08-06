namespace editor
{
	export class ComponentView extends eui.Component
	{
		component: feng3d.Component;
		componentView: feng3d.IObjectView;

		//
		public accordion: editor.Accordion;

		//
		public enabledCB: eui.CheckBox;
		public componentIcon: eui.Image;
		public helpBtn: eui.Button;
		public operationBtn: eui.Button;

		scriptView: feng3d.IObjectView;

		/**
		 * 对象界面数据
		 */
		constructor(component: feng3d.Component)
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
			var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
			this.accordion.titleName = componentName;
			this.componentView = feng3d.objectview.getObjectView(this.component, false, ["enabled"]);
			this.accordion.addContent(this.componentView);

			this.enabledCB = this.accordion["enabledCB"];
			this.componentIcon = this.accordion["componentIcon"];
			this.helpBtn = this.accordion["helpBtn"];
			this.operationBtn = this.accordion["operationBtn"];

			if (this.component instanceof feng3d.Transform)
			{
				this.componentIcon.source = "Transform_png";
			} else if (this.component instanceof feng3d.Water)
			{
				this.componentIcon.source = "Water_png";
			} else if (this.component instanceof feng3d.Terrain)
			{
				this.componentIcon.source = "Terrain_png";
			} else if (this.component instanceof feng3d.Model)
			{
				this.componentIcon.source = "Model_png";
			} else if (this.component instanceof feng3d.ScriptComponent)
			{
				this.componentIcon.source = "ScriptComponent_png";
			} else if (this.component instanceof feng3d.Camera)
			{
				this.componentIcon.source = "Camera_png";
			} else if (this.component instanceof feng3d.AudioSource)
			{
				this.componentIcon.source = "AudioSource_png";
			} else if (this.component instanceof feng3d.SpotLight)
			{
				this.componentIcon.source = "SpotLight_png";
			} else if (this.component instanceof feng3d.PointLight)
			{
				this.componentIcon.source = "PointLight_png";
			} else if (this.component instanceof feng3d.DirectionalLight)
			{
				this.componentIcon.source = "DirectionalLight_png";
			} else if (this.component instanceof feng3d.FPSController)
			{
				this.componentIcon.source = "FPSController_png";
			} else if (this.component instanceof feng3d.AudioListener)
			{
				this.componentIcon.source = "AudioListener_png";
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

			this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			if (this.component instanceof feng3d.Behaviour)
				feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);

			this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
			this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
			feng3d.feng3dDispatcher.on("assets.scriptChanged", this.onScriptChanged, this);
		}

		private onRemovedFromStage()
		{
			this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
			if (this.component instanceof feng3d.Behaviour)
				feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);

			this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
			this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
			feng3d.feng3dDispatcher.off("assets.scriptChanged", this.onScriptChanged, this);
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
			if (this.component instanceof feng3d.ScriptComponent)
			{
				feng3d.watcher.watch(this.component, "script", this.onScriptChanged, this);
				var component = this.component;
				if (component.scriptInstance)
				{
					this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, false);
					this.accordion.addContent(this.scriptView);
				}
			}
		}

		private removeScriptView()
		{
			// 移除Script属性面板
			if (this.component instanceof feng3d.ScriptComponent)
			{
				feng3d.watcher.unwatch(this.component, "script", this.onScriptChanged, this);
			}
			if (this.scriptView)
			{
				if (this.scriptView.parent)
					this.scriptView.parent.removeChild(this.scriptView);
			}
		}

		private onOperationBtnClick()
		{
			var menus: MenuItem[] = [];

			if (!(this.component instanceof feng3d.Transform))
			{
				menus.push({
					label: "移除组件",
					click: () =>
					{
						if (this.component.gameObject)
							this.component.gameObject.removeComponent(this.component);
					}
				});
			}

			menu.popup(menus, this.stage.stageWidth - 150);
		}

		private onHelpBtnClick()
		{
			window.open(`http://feng3d.gitee.io/#/script`);
		}

		private onScriptChanged()
		{
			setTimeout(() =>
			{
				this.removeScriptView();
				this.initScriptView();
			}, 10);
		}
	}
}