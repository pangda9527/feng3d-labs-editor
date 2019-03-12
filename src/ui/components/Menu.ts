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
        accelerator?: string,
        role?: string,
        type?: 'separator',
        /**
         * 点击事件
         */
        click?: () => void,
        /**
         * 子菜单
         */
        submenu?: MenuItem[]
        /**
         * 是否启用，禁用时显示灰色
         */
        enable?: boolean;
        /**
         * 是否显示，默认显示
         */
        show?: boolean;
    };

    export class Menu
    {
        /**
         * 弹出菜单
         * 
         * 
         * @param menu 菜单数据
         * 
         * @returns
该功能存在一个暂时无法解决的bug
```
[{
    label: "Rendering",
    submenu: [
        { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
        { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
        { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
    ]
}]
```
如上代码中 ``` "Camera" ``` 比 ``` "DirectionalLight" ``` 要短时会出现子菜单盖住父菜单情况，代码需要修改如下才能规避该情况
```
[{
    label: "Rendering",
    submenu: [
        { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
        { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
        { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
    ]
}]
```
         * 
         */
        popup(menu: MenuItem[])
        {
            var menuUI = MenuUI.create(menu);
            maskview.mask(menuUI);
        }

        popupEnum(enumDefinition: Object, currentValue: any, selectCallBack: (v) => void)
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

            this.popup(menu)
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

        static create(menu: MenuItem[], menuItemRendererRect: egret.Rectangle = null)
        {
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);

            menuUI.dataProvider = dataProvider;
            editorui.popupLayer.addChild(menuUI);

            if (!menuItemRendererRect)
            {
                menuUI.x = feng3d.windowEventProxy.clientX;
                menuUI.y = feng3d.windowEventProxy.clientY;

                if (menuUI.x + menuUI.width > editorui.popupLayer.stage.stageWidth - 10)
                    menuUI.x = editorui.popupLayer.stage.stageWidth - menuUI.width - 10;
            } else
            {
                menuUI.x = menuItemRendererRect.right;
                menuUI.y = menuItemRendererRect.top;

                if (menuUI.x + menuUI.width > editorui.popupLayer.stage.stageWidth)
                {
                    menuUI.x = menuItemRendererRect.left - menuUI.width;
                }
            }
            if (menuUI.y + menuUI.height > editorui.popupLayer.stage.stageHeight)
                menuUI.y = editorui.popupLayer.stage.stageHeight - menuUI.height;

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

    export class MenuItemRenderer extends eui.ItemRenderer
    {
        data: MenuItem;
        menuUI: MenuUI;

        public selectedRect: eui.Rect;

        protected dataChanged()
        {
            super.dataChanged();
            this.updateView();
        }

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "MenuItemRender";
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
            this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
            this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);

            this.menuUI = <any>this.parent;

            this.updateView();
        }

        private onRemovedFromStage()
        {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);

            this.menuUI = null;
        }

        private updateView()
        {
            if (!this.data)
                return;
            this.touchEnabled = true;
            this.touchChildren = true;
            if (this.data.type == 'separator')
            {
                this.skin.currentState = "separator";
                this.touchEnabled = false;
                this.touchChildren = false;
            }
            else if (this.data.submenu)
            {
                this.skin.currentState = "sub";
            }
            else
            {
                this.skin.currentState = "normal";
            }
            this.selectedRect.visible = false;
        }

        private onItemMouseDown(event: egret.TouchEvent): void
        {
            this.data.click && this.data.click();
            this.menuUI.topMenu.remove();
        }

        private onItemMouseOver()
        {
            if (this.data.submenu)
            {
                var rect = this.getTransformedBounds(this.stage);
                this.menuUI.subMenuUI = MenuUI.create(this.data.submenu, rect);
                this.menuUI.subMenuUI.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            } else
            {
                this.menuUI.subMenuUI = null;
            }
            this.selectedRect.visible = true;
        }

        private onItemMouseOut()
        {
            if (!this.menuUI.subMenuUI)
                this.selectedRect.visible = false;
        }

        private onsubMenuUIRemovedFromeStage(e: egret.Event)
        {
            var current = e.currentTarget;
            current.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            this.selectedRect.visible = false;
        }
    }
}