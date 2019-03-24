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
	 * Tab 界面
	 */
	export class TabView extends eui.Group
	{
		//
		private _tabViewInstance: TabViewInstance;

		constructor()
		{
			super();
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();

			var moduleviews: ModuleView[] = [];
			for (let i = this.numChildren - 1; i >= 0; i--)
			{
				let child = this.getChildAt(i);
				moduleviews.push(<any>child);
				this.removeChildAt(i);
			}
			moduleviews = moduleviews.reverse();
			//
			this._tabViewInstance = new TabViewInstance(moduleviews);
			this._tabViewInstance.left = this._tabViewInstance.right = this._tabViewInstance.top = this._tabViewInstance.bottom = 0;
			this.addChild(this._tabViewInstance);
		}

		/**
		 * 获取模块名称列表
		 */
		getModuleNames()
		{
			return this._tabViewInstance.getModuleNames();
		}
	}

	export class TabViewInstance extends eui.Component
	{

		public tabGroup: eui.Group;
		public contentGroup: eui.Group;
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

		/**
		 * 获取模块名称列表
		 */
		getModuleNames()
		{
			var moduleNames = this._moduleViews.map(v => v.moduleName);
			return moduleNames;
		}

		constructor(moduleviews: ModuleView[])
		{
			super();

			this._moduleViews = moduleviews;
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "TabViewSkin";
		}

		private onComplete(): void
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

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
			// 获取模块列表
			for (let i = this.contentGroup.numChildren - 1; i >= 0; i--)
			{
				let child = this.contentGroup.getChildAt(i);
				if (child.parent) child.parent.removeChildAt(i);
				//
				let moduleView: ModuleView = <any>child;
				this._moduleViews.push(moduleView);
				if (moduleView.visible) this._showModule = moduleView.moduleName;
				moduleView.visible = true;
			}
			this._moduleViews = this._moduleViews.reverse();
			// 设置默认显示模块名称
			if (this._showModule == undefined) this._showModule = (this._moduleViews[0] && this._moduleViews[0].moduleName);
			// 初始化按钮
			for (let i = 0; i < this._moduleViews.length; i++)
			{
				let tabButton = this._tabViewButtonPool.pop();
				if (!tabButton) tabButton = new TabViewButton();
				this._tabButtons.push(tabButton);
			}

			//
			if (this.stage)
			{
				this._onAddedToStage();
			}
		}

		private _onAddedToStage()
		{
			this._tabButtons.forEach(v =>
			{
				v.addEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
			});

			this._invalidateView()
		}

		private onRemovedFromStage()
		{
			this._tabButtons.forEach(v =>
			{
				v.removeEventListener(egret.MouseEvent.CLICK, this._onTabButtonClick, this);
			});
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
			// 控制按钮状态
			for (let i = 0; i < this._moduleViews.length; i++)
			{
				let tabButton = this._tabButtons[i];
				tabButton.moduleName = this._moduleViews[i].moduleName;
				tabButton.currentState = tabButton.moduleName == this._showModule ? "selected" : "up";
				this.tabGroup.addChild(tabButton);
			}
			// 保留显示模块，移除其它模块
			for (let i = 0; i < this._moduleViews.length; i++)
			{
				let moduleView = this._moduleViews[i];
				if (moduleView.moduleName == this._showModule)
				{
					if (!moduleView.parent) this.contentGroup.addChild(moduleView);
				} else
				{
					if (moduleView.parent) moduleView.parent.removeChild(moduleView);
				}
			}
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
}
