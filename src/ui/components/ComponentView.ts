
export const componentIconMap = new Map<any, string>();

componentIconMap.set(feng3d.Transform, "Transform_png");
componentIconMap.set(feng3d.Water, "Water_png");
componentIconMap.set(feng3d.Renderable, "Model_png");
componentIconMap.set(feng3d.ScriptComponent, "ScriptComponent_png");
componentIconMap.set(feng3d.Camera, "Camera_png");
componentIconMap.set(feng3d.AudioSource, "AudioSource_png");
componentIconMap.set(feng3d.AudioListener, "AudioListener_png");
componentIconMap.set(feng3d.SpotLight, "SpotLight_png");
componentIconMap.set(feng3d.PointLight, "PointLight_png");
componentIconMap.set(feng3d.DirectionalLight, "DirectionalLight_png");
componentIconMap.set(feng3d.FPSController, "FPSController_png");
componentIconMap.set(feng3d.Terrain, "Terrain_png");

export class ComponentView extends eui.Component
{
	component: feng3d.Components;
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
	constructor(component: feng3d.Components)
	{
		super();
		this.component = component;

		component.on("refreshView", this.onRefreshView, this);
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
		this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
		this.accordion.addContent(this.componentView);

		this.enabledCB = this.accordion["enabledCB"];
		this.componentIcon = this.accordion["componentIcon"];
		this.helpBtn = this.accordion["helpBtn"];
		this.operationBtn = this.accordion["operationBtn"];

		var icon = componentIconMap.get(<any>this.component.constructor);
		if (icon)
		{
			this.componentIcon.source = icon;
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
		feng3d.globalEmitter.on("asset.scriptChanged", this.onScriptChanged, this);
	}

	private onRemovedFromStage()
	{
		this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
		if (this.component instanceof feng3d.Behaviour)
			feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);

		this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
		this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
		feng3d.globalEmitter.off("asset.scriptChanged", this.onScriptChanged, this);
	}

	private onRefreshView()
	{
		this.accordion.removeContent(this.componentView);
		this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
		this.accordion.addContent(this.componentView);
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
		// 初始化Script属性界面
		if (this.component instanceof feng3d.ScriptComponent)
		{
			feng3d.watcher.watch(this.component, "scriptName", this.onScriptChanged, this);
			var component = this.component;
			if (component.scriptInstance)
			{
				this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, { autocreate: false });
				this.accordion.addContent(this.scriptView);
			}
		}
	}

	private removeScriptView()
	{
		// 移除Script属性界面
		if (this.component instanceof feng3d.ScriptComponent)
		{
			feng3d.watcher.unwatch(this.component, "scriptName", this.onScriptChanged, this);
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
		menu.popup(menus);
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
