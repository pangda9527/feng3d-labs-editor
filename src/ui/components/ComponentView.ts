import { AudioListener, AudioSource, Behaviour, Camera, classUtils, Components, DirectionalLight, FPSController, globalEmitter, IObjectView, objectview, PointLight, Renderable, ScriptComponent, SpotLight, Terrain, Transform, watcher, Water } from 'feng3d';
import { Accordion } from './Accordion';
import { menu, MenuItem } from './Menu';

export const componentIconMap = new Map<any, string>();

componentIconMap.set(Transform, "Transform_png");
componentIconMap.set(Water, "Water_png");
componentIconMap.set(Renderable, "Model_png");
componentIconMap.set(ScriptComponent, "ScriptComponent_png");
componentIconMap.set(Camera, "Camera_png");
componentIconMap.set(AudioSource, "AudioSource_png");
componentIconMap.set(AudioListener, "AudioListener_png");
componentIconMap.set(SpotLight, "SpotLight_png");
componentIconMap.set(PointLight, "PointLight_png");
componentIconMap.set(DirectionalLight, "DirectionalLight_png");
componentIconMap.set(FPSController, "FPSController_png");
componentIconMap.set(Terrain, "Terrain_png");

export class ComponentView extends eui.Component
{
	component: Components;
	componentView: IObjectView;

	//
	public accordion: Accordion;

	//
	public enabledCB: eui.CheckBox;
	public componentIcon: eui.Image;
	public helpBtn: eui.Button;
	public operationBtn: eui.Button;

	scriptView: IObjectView;

	/**
	 * 对象界面数据
	 */
	constructor(component: Components)
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
		var componentName = classUtils.getQualifiedClassName(this.component).split(".").pop();
		this.accordion.titleName = componentName;
		this.componentView = objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
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
		if (this.component instanceof Behaviour)
			watcher.watch(this.component, "enabled", this.updateEnableCB, this);

		this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
		this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
		globalEmitter.on("asset.scriptChanged", this.onScriptChanged, this);
	}

	private onRemovedFromStage()
	{
		this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
		if (this.component instanceof Behaviour)
			watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);

		this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
		this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
		globalEmitter.off("asset.scriptChanged", this.onScriptChanged, this);
	}

	private onRefreshView()
	{
		this.accordion.removeContent(this.componentView);
		this.componentView = objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
		this.accordion.addContent(this.componentView);
	}

	private updateEnableCB()
	{
		if (this.component instanceof Behaviour)
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
		if (this.component instanceof Behaviour)
		{
			this.component.enabled = this.enabledCB.selected;
		}
	}

	private initScriptView()
	{
		// 初始化Script属性界面
		if (this.component instanceof ScriptComponent)
		{
			watcher.watch(this.component, "scriptName", this.onScriptChanged, this);
			var component = this.component;
			if (component.scriptInstance)
			{
				this.scriptView = objectview.getObjectView(component.scriptInstance, { autocreate: false });
				this.accordion.addContent(this.scriptView);
			}
		}
	}

	private removeScriptView()
	{
		// 移除Script属性界面
		if (this.component instanceof ScriptComponent)
		{
			watcher.unwatch(this.component, "scriptName", this.onScriptChanged, this);
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

		if (!(this.component instanceof Transform))
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
		window.open(`http://gitee.io/#/script`);
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
