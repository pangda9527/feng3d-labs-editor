namespace editor
{
	/**
	 * TabView 按钮
	 */
	export class TabViewButton extends eui.Button
	{
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
			this._invalidateView()
		}
		private _moduleName: string;

		public constructor()
		{
			super();
			this.skinName = "TabViewButtonSkin";
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();
			this._moduleName = this.label;
		}

		private _invalidateView()
		{
			this.once(egret.Event.ENTER_FRAME, this._updateView, this);
		}

		private _updateView()
		{
			this.label = this._moduleName;
		}

	}

}