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
        popup(menu: MenuItem[], parm?: { mousex?: number, mousey?: number, width?: number })
        {
            var menuUI = MenuUI.create(menu, parm);
            maskview.mask(menuUI);
        }

        popupEnum(enumDefinition: Object, currentValue: any, selectCallBack: (v) => void, parm?: { mousex?: number, mousey?: number, width?: number })
        {
            var menu: MenuItem[] = [];
            for (const key in enumDefinition)
            {
                if (enumDefinition.hasOwnProperty(key))
                {
                    if (isNaN(Number(key)))
                    {
                        menu.push({
                            label: (currentValue == enumDefinition[key] ? "√ " : "   ") + key,
                            click: ((v) =>
                            {
                                return () => selectCallBack(v);
                            })(enumDefinition[key])
                        });
                    }
                }
            }

            this.popup(menu, parm)
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

        static create(menu: MenuItem[], parm?: { mousex?: number, mousey?: number, width?: number })
        {
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);

            menuUI.dataProvider = dataProvider;
            editorui.popupLayer.addChild(menuUI);

            // parm = Object.assign({ width: 150 }, parm);
            parm = parm || {};

            if (parm.width !== undefined)
                menuUI.width = parm.width;
            menuUI.x = parm.mousex || feng3d.windowEventProxy.clientX;
            menuUI.y = parm.mousey || feng3d.windowEventProxy.clientY;

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