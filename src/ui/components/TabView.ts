namespace editor
{
	export interface ModuleView extends eui.Component
	{
		/**
		 * 模块名称
		 */
		moduleName: string;
	}

	/**
	 * 拖拽数据
	 */
	export interface DragData
	{
		moduleView: { tabView: TabView, moduleName: string };
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
		private _showModule: string;

		//
		private tabGroup: eui.Group;
		private contentGroup: eui.Group;

		/**
		 * 获取模块名称列表
		 */
		getModuleNames()
		{
			var moduleNames = this._moduleViews.map(v => v.moduleName);
			return moduleNames;
		}

		setModuleNames(moduleNames: string[])
		{
			// 移除所有模块界面
			this._moduleViews.concat().forEach(v =>
			{
				v.parent && v.parent.removeChild(v);
			});
			//
			this._moduleViews = [];
			moduleNames.forEach(v =>
			{
				var moduleView: ModuleView;
				switch (v)
				{
					case HierarchyView.moduleName:
						moduleView = new HierarchyView();
						break;
					case InspectorView.moduleName:
						moduleView = new InspectorView();
						break;
					case AssetView.moduleName:
						moduleView = new AssetView();
						break;
					case Feng3dView.moduleName:
						moduleView = new Feng3dView();
						break;
					case NavigationView.moduleName:
						moduleView = new NavigationView();
						break;
					default:
						break;
				}
				if (moduleView)
				{
					moduleView.top = moduleView.bottom = moduleView.left = moduleView.right = 0;
					this._moduleViews.push(moduleView);
				} else
				{
					console.warn(`没有找到对应模块界面 ${v}`);
				}
			});
		}

		constructor()
		{
			super();
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();

			//
			this.$children.forEach(v =>
			{
				this._moduleViews.push(<any>v);
			});
			this._moduleViews.forEach(v =>
			{
				v.parent && v.parent.removeChild(v);
				if (this._showModule == null && v.visible) this._showModule = v.moduleName;
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
				let child = this.tabGroup.getChildAt(i);
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
			drag.register(this.tabGroup, null, ["moduleView"], (dragSource) =>
			{
				if (dragSource.moduleView.tabView == this)
				{
					let result = this._moduleViews.filter(v => v.moduleName == dragSource.moduleView.moduleName)[0];
					if (result)
					{
						let index = this._moduleViews.indexOf(result);
						this._moduleViews.splice(index, 1);
						this._moduleViews.push(result);
						this._invalidateView();
					}
				} else
				{
					let moduleView = dragSource.moduleView.tabView.removeModule(dragSource.moduleView.moduleName);
					this.addModule(moduleView);
				}
			});
			drag.register(this.contentGroup, null, ["moduleView"], (dragSource) =>
			{

			});
			this._invalidateView()
		}

		private addModule(moduleView: ModuleView)
		{
			this._moduleViews.push(moduleView);
			this._showModule = moduleView.moduleName;
			this._invalidateView();
		}

		private removeModule(moduleName: string)
		{
			let moduleView = this._moduleViews.filter(v => v.moduleName == moduleName)[0];
			var index = this._moduleViews.indexOf(moduleView);
			feng3d.assert(index != -1);
			this._moduleViews.splice(index, 1);

			this._invalidateView();

			return moduleView;
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
			var moduleNames = this._moduleViews.map(v => v.moduleName);
			// 设置默认显示模块名称
			if (moduleNames.indexOf(this._showModule) == -1) this._showModule = (this._moduleViews[0] && this._moduleViews[0].moduleName);

			var buttonNum = this._tabButtons.length;
			var viewNum = this._moduleViews.length;
			for (var i = 0, max = Math.max(buttonNum, viewNum); i < max; i++)
			{
				if (i >= buttonNum)
				{
					//
					var tabButton = this._tabViewButtonPool.pop();
					if (!tabButton) tabButton = new TabViewButton();
					tabButton.addEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
					//
					drag.register(tabButton, (dragSource) =>
					{
						dragSource.moduleView = { tabView: <any>this, moduleName: tabButton.moduleName };
					}, []);
					this._tabButtons.push(tabButton);
				}
				if (i >= viewNum)
				{
					var tabButton = this._tabButtons[i];
					tabButton.parent && tabButton.parent.removeChild(tabButton);
					this._tabViewButtonPool.push(tabButton);
					tabButton.removeEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
					//
					drag.unregister(tabButton);
				}
				if (i < viewNum)
				{
					var tabButton = this._tabButtons[i];
					var moduleView = this._moduleViews[i];
					//
					tabButton.moduleName = moduleView.moduleName;
					tabButton.currentState = tabButton.moduleName == this._showModule ? "selected" : "up";
					this.tabGroup.addChild(tabButton);
					//
					if (moduleView.moduleName == this._showModule)
					{
						this.contentGroup.addChild(moduleView);
					} else
					{
						if (moduleView.parent) moduleView.parent.removeChild(moduleView);
					}
				}
			}
			this._tabButtons.length = viewNum;
		}

		/**
		 * 点击按钮事件
		 * 
		 * @param e 
		 */
		private _onTabButtonClick(e: egret.Event)
		{
			var index = this._tabButtons.indexOf(e.currentTarget);
			if (index != -1 && this._tabButtons[index].moduleName != this._showModule)
			{
				this._showModule = this._tabButtons[index].moduleName;
				this._invalidateView();
			}
		}
	}

	class TabViewUI extends eui.Component
	{
		public tabGroup: eui.Group;
		public contentGroup: eui.Group;

		constructor()
		{
			super();
			this.skinName = "TabViewSkin";
		}
	}
}
