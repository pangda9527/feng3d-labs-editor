import { globalEmitter, Vector2, mathUtil } from 'feng3d';
import { editorui } from '../../global/editorui';
import { modules } from '../../Modules';
import { ProjectView } from '../assets/ProjectView';
import { drag } from '../drag/Drag';
import { HierarchyView } from '../hierarchy/HierarchyView';
import { InspectorView } from '../inspector/InspectorView';
import { SceneView } from '../SceneView';
import { menu } from './Menu';
import { SplitGroup } from './SplitGroup';
import { WindowView } from './WindowView';

declare global
{
	export interface MixinsDragDataMap
	{
		moduleView: { tabView: TabView, moduleName: string };
	}
}

export interface ModuleView extends eui.Component
{
	/**
	 * 模块名称
	 */
	moduleName: string;
}

/**
 * Tab 界面
 */
export class TabView extends eui.Group
{
	//
	private _tabViewInstance: TabViewUI;

	/**
	 * 按钮池
	 */
	private _tabViewButtonPool: TabViewButton[] = [];
	/**
	 * 模块按钮列表
	 */
	private _tabButtons: TabViewButton[] = [];
	/**
	 * 模块界面列表
	 */
	private _moduleViews: ModuleView[] = [];
	/**
	 * 显示模块
	 */
	private _showModuleIndex = -1;

	//
	private tabGroup: eui.Group;
	private contentGroup: eui.Group;

	/**
	 * 获取模块名称列表
	 */
	getModuleNames()
	{
		const moduleNames = this._moduleViews.map((v) => v.moduleName);

		return moduleNames;
	}

	setModuleNames(moduleNames: string[])
	{
		// 移除所有模块界面
		this._moduleViews.concat().forEach((v) =>
		{
			v.parent && v.parent.removeChild(v);
		});
		//
		this._moduleViews = [];
		moduleNames.forEach((v) =>
		{
			this.addModuleByName(v);
		});
		this._showModuleIndex = 0;
	}

	constructor()
	{
		super();
	}

	protected childrenCreated(): void
	{
		super.childrenCreated();

		//
		this.$children.forEach((v) =>
		{
			this._moduleViews.push(<any>v);
		});
		this._moduleViews.forEach((v, index) =>
		{
			v.parent && v.parent.removeChild(v);
			if (!this._showModuleIndex && v.visible) this._showModuleIndex = index;
			v.visible = true;
		});
		//
		this._tabViewInstance = new TabViewUI();
		this._tabViewInstance.left = this._tabViewInstance.right = this._tabViewInstance.top = this._tabViewInstance.bottom = 0;
		this.addChild(this._tabViewInstance);
		//
		// this._tabViewInstance.once(eui.UIEvent.COMPLETE, this.onComplete, this);

		this.onComplete();
	}

	private onComplete(): void
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		//
		this.tabGroup = this._tabViewInstance.tabGroup;
		this.contentGroup = this._tabViewInstance.contentGroup;

		// 获取按钮列表
		for (let i = this.tabGroup.numChildren - 1; i >= 0; i--)
		{
			const child = this.tabGroup.getChildAt(i);
			if (child instanceof TabViewButton)
			{
				this._tabViewButtonPool.push(child);
				this.tabGroup.removeChildAt(i);
			}
		}
		//
		if (this.stage)
		{
			this._onAddedToStage();
		}
	}

	private _onAddedToStage()
	{
		drag.register(this.tabGroup, null, ['moduleView'], (dragSource) =>
		{
			dragSource.getDragData('moduleView').forEach((v) =>
			{
				if (v.tabView === this)
				{
					const result = this._moduleViews.filter((v1) => v1.moduleName === v.moduleName)[0];
					if (result)
					{
						const index = this._moduleViews.indexOf(result);
						this._moduleViews.splice(index, 1);
						this._moduleViews.push(result);
						this._invalidateView();
					}
				}
				else
				{
					const moduleView = v.tabView.removeModule(v.moduleName);
					this.addModule(moduleView);
				}
				globalEmitter.emit('viewLayout.changed');
			});
		});
		drag.register(this.contentGroup, null, ['moduleView'], (dragSource) =>
		{
			dragSource.getDragData('moduleView').forEach((v) =>
			{
				if (v.tabView === this && this._moduleViews.length === 1) return;

				const moduleView = v.tabView.removeModule(v.moduleName);

				const rect = this.getGlobalBounds();
				const center = rect.center;
				const mouse = new Vector2(editorui.stage.stageX, editorui.stage.stageY);
				const sub = mouse.sub(center);
				sub.x = sub.x / rect.width;
				sub.y = sub.y / rect.height;
				if (sub.x * sub.x > sub.y * sub.y)
				{
					this.addModuleToLeft(moduleView, sub.x < 0 ? 4 : 6);
				}
				else
				{
					this.addModuleToLeft(moduleView, sub.y < 0 ? 8 : 2);
				}
				globalEmitter.emit('viewLayout.changed');
			});
		});
		this._invalidateView();
	}

	private addModuleToLeft(moduleView: ModuleView, dir = 4)
	{
		//
		const tabView = new TabView();
		tabView.addModule(moduleView);
		//
		const splitGroup = new SplitGroup();
		this.copyLayoutInfo(this, splitGroup);
		if (dir === 4 || dir === 6)
		{
			const layout = splitGroup.layout = new eui.HorizontalLayout();
			layout.gap = 2;
			//
			tabView.percentHeight = 100;
			tabView.percentWidth = 30;
			this.percentHeight = 100;
			this.percentWidth = 70;
		}
		else if (dir === 8 || dir === 2)
		{
			const layout1 = splitGroup.layout = new eui.VerticalLayout();
			layout1.gap = 2;
			//
			tabView.percentHeight = 30;
			tabView.percentWidth = 100;
			this.percentHeight = 70;
			this.percentWidth = 100;
		}
		//
		const parent = this.parent;
		const index = parent.getChildIndex(this);
		parent.removeChildAt(index);
		//
		if (dir === 4 || dir === 8)
		{
			splitGroup.addChild(tabView);
			splitGroup.addChild(this);
		}
		else if (dir === 2 || dir === 6)
		{
			splitGroup.addChild(this);
			splitGroup.addChild(tabView);
		}
		//
		parent.addChildAt(splitGroup, index);
	}

	private addModuleByName(moduleName: string)
	{
		const moduleView: ModuleView = modules.getModuleView(moduleName);
		if (moduleView)
		{
			moduleView.top = moduleView.bottom = moduleView.left = moduleView.right = 0;
			this._moduleViews.push(moduleView);

			this._showModuleIndex = this._moduleViews.length - 1;
			this._invalidateView();
		}
		else
		{
			console.warn(`没有找到对应模块界面 ${moduleName}`);
		}
	}

	private addModule(moduleView: ModuleView)
	{
		this._moduleViews.push(moduleView);
		this._showModuleIndex = this._moduleViews.length - 1;
		this._invalidateView();
	}

	private removeModule(moduleName: string)
	{
		const moduleView = this._moduleViews.filter((v) => v.moduleName === moduleName)[0];
		const index = this._moduleViews.indexOf(moduleView);
		console.assert(index !== -1);
		this._moduleViews.splice(index, 1);

		this.adjust(this);

		this._invalidateView();

		return moduleView;
	}

	private adjust(view: egret.DisplayObject)
	{
		const parent = view.parent;
		if (view instanceof TabView)
		{
			// 当模块全被移除时移除 TabView
			if (view._moduleViews.length === 0)
			{
				this.remove();
				this.adjust(parent);
			}
		}
		else if (view instanceof SplitGroup)
		{
			if (view.numChildren > 1)
			{
				if (view.layout instanceof eui.HorizontalLayout)
				{
					const total = view.$children.reduce((pv, cv) => pv + cv.width, 0);
					view.$children.forEach((v: eui.Component) => { v.percentWidth = v.width / total * 100; });
				}
				else if (view.layout instanceof eui.VerticalLayout)
				{
					const total = view.$children.reduce((pv, cv) => pv + cv.height, 0);
					view.$children.forEach((v: eui.Component) => { v.percentHeight = v.height / total * 100; });
				}
			}
			else if (view.numChildren === 1)
			{
				const child = <eui.Component>view.getChildAt(0);
				this.copyLayoutInfo(view, child);
				//
				const index = parent.getChildIndex(view);
				parent.removeChildAt(index);
				parent.addChildAt(child, index);
				//
				this.adjust(parent);
			}
			else
			{
				console.assert(false);
			}
		}
		// 找到对象所属窗口，删除空窗口
		const windowView = WindowView.getWindow(parent);
		if (windowView && windowView.contenGroup.numChildren === 0) windowView.remove();
	}

	private copyLayoutInfo(src: eui.Component | eui.Group, dest: eui.Component | eui.Group)
	{
		dest.x = src.x;
		dest.y = src.y;
		dest.width = src.width;
		dest.height = src.height;
		dest.top = src.top;
		dest.bottom = src.bottom;
		dest.left = src.left;
		dest.right = src.right;
		dest.percentWidth = src.percentWidth;
		dest.percentHeight = src.percentHeight;
	}

	private onRemovedFromStage()
	{
		drag.unregister(this.tabGroup);
		drag.unregister(this.contentGroup);
	}

	/**
	 * 界面显示失效
	 */
	private _invalidateView()
	{
		this.once(egret.Event.ENTER_FRAME, this._updateView, this);
	}

	/**
	 * 更新界面
	 */
	private _updateView()
	{
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const moduleNames = this._moduleViews.map((v) => v.moduleName);
		// 设置默认显示模块名称
		this._showModuleIndex = mathUtil.clamp(this._showModuleIndex, 0, this._moduleViews.length - 1);

		this._tabButtons.forEach((v) =>
		{
			v.removeEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
			v.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onTabButtonRightClick, this);
			//
			drag.unregister(v);
		});
		//
		const buttonNum = this._tabButtons.length;
		const viewNum = this._moduleViews.length;
		for (let i = 0, max = Math.max(buttonNum, viewNum); i < max; i++)
		{
			if (i >= buttonNum)
			{
				//
				let tabButton = this._tabViewButtonPool.pop();
				if (!tabButton) tabButton = new TabViewButton();
				this._tabButtons.push(tabButton);
			}
			if (i >= viewNum)
			{
				const tabButton = this._tabButtons[i];
				tabButton.parent && tabButton.parent.removeChild(tabButton);
				this._tabViewButtonPool.push(tabButton);
			}
			if (i < viewNum)
			{
				const tabButton = this._tabButtons[i];
				const moduleView = this._moduleViews[i];
				//
				tabButton.moduleName = moduleView.moduleName;
				this.tabGroup.addChild(tabButton);
				//
				if (i === this._showModuleIndex)
				{
					tabButton.currentState = 'selected';
					this.contentGroup.addChild(moduleView);
				}
				else
				{
					tabButton.currentState = 'up';
					if (moduleView.parent) moduleView.parent.removeChild(moduleView);
				}
			}
		}
		this._tabButtons.length = viewNum;
		this._tabButtons.forEach((v) =>
		{
			v.addEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
			//
			drag.register(v, (dragSource) =>
			{
				dragSource.addDragData('moduleView', { tabView: <any>this, moduleName: v.moduleName });
			}, []);
			v.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onTabButtonRightClick, this);
		});
	}

	/**
	 * 点击按钮事件
	 *
	 * @param e
	 */
	private _onTabButtonClick(e: egret.Event)
	{
		const index = this._tabButtons.indexOf(e.currentTarget);
		if (index !== this._showModuleIndex)
		{
			this._showModuleIndex = index;
			this._invalidateView();
		}
	}

	private onTabButtonRightClick(e: egret.Event)
	{
		const tabButton = <TabViewButton>e.currentTarget;

		menu.popup([
			{
				label: 'Close Tab', click: () =>
				{
					const moduleView = this.removeModule(tabButton.moduleName);
					modules.recycleModuleView(moduleView);
				}
			},
			{ type: 'separator' },
			{
				label: 'Add Tab',
				submenu: [SceneView.moduleName, InspectorView.moduleName, HierarchyView.moduleName, ProjectView.moduleName].map((v) =>
				{
					const item = {
						label: v,
						click: () => { this.addModuleByName(v); },
					};

					return item;
				}),
			},
		]);
	}
}

/**
 * TabView 按钮
 */
class TabViewButton extends eui.Button
{
	declare public iconDisplay: eui.Image;
	declare public labelDisplay: eui.Label;

	/**
	 * 模块名称
	 */
	public get moduleName(): string
	{
		return this._moduleName;
	}
	public set moduleName(value: string)
	{
		this._moduleName = value;
		this._invalidateView();
	}
	private _moduleName: string;

	public constructor()
	{
		super();
		this.skinName = 'TabViewButtonSkin';
	}

	protected childrenCreated(): void
	{
		super.childrenCreated();
		this._invalidateView();
	}

	private _invalidateView()
	{
		this.once(egret.Event.ENTER_FRAME, this._updateView, this);
	}

	private _updateView()
	{
		this.label = this._moduleName;

		this.iconDisplay.source = `${this._moduleName}Icon_png`;
	}
}

class TabViewUI extends eui.Component
{
	public tabGroup: eui.Group;
	public contentGroup: eui.Group;

	constructor()
	{
		super();
		this.skinName = 'TabViewSkin';
	}
}
