namespace editor
{
    /**
     * 菜单
     */
    export var menu: Menu;

    export type MenuItem = {
        /**
         * 显示标签
         */
        label?: string,
        accelerator?: string, role?: string, type?: 'separator',
        /**
         * 点击事件
         */
        click?: () => void,
        /**
         * 子菜单
         */
        submenu?: MenuItem[]
    };

    export class Menu
    {
        popup(menu: MenuItem[], mousex?: number, mousey?: number, width = 150)
        {
            var menuUI = MenuUI.create(menu, mousex, mousey, width);
            maskview.mask(menuUI);
        }
    };

    menu = new Menu();

    export class MenuUI extends eui.List
    {
        get subMenuUI()
        {
            return this._subMenuUI;
        }
        set subMenuUI(v)
        {
            if (this._subMenuUI)
                this._subMenuUI.remove();
            this._subMenuUI = v;
            if (this._subMenuUI)
                this._subMenuUI.parentMenuUI = this;
        }
        private _subMenuUI: MenuUI;

        private parentMenuUI: MenuUI;

        get topMenu()
        {
            var m: MenuUI = this.parentMenuUI ? this.parentMenuUI.topMenu : this;
            return m;
        }

        constructor()
        {
            super();
            this.itemRenderer = MenuItemRenderer;
            this.onComplete();
        }

        static create(menu: MenuItem[], mousex?: number, mousey?: number, width = 150)
        {
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);

            menuUI.dataProvider = dataProvider;
            editorui.popupLayer.addChild(menuUI);

            if (width !== undefined)
                menuUI.width = width;
            menuUI.x = mousex || feng3d.windowEventProxy.clientX;
            menuUI.y = mousey || feng3d.windowEventProxy.clientY;

            if (menuUI.x + menuUI.width > editorui.popupLayer.stage.stageWidth)
                menuUI.x -= menuUI.width;

            if (menuUI.y + menuUI.height > editorui.popupLayer.stage.stageHeight)
                menuUI.y -= menuUI.height;

            return menuUI;
        }

        private onComplete(): void
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.subMenuUI = null;
            this.parentMenuUI = null;
        }

        private updateView()
        {
        }

        remove()
        {
            this.parent && this.parent.removeChild(this);
        }
    }
}