"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var editorui_1 = require("../../global/editorui");
var Maskview_1 = require("./Maskview");
var Menu = /** @class */ (function () {
    function Menu() {
    }
    /**
     * 弹出菜单
     *
     *
     * @param menuItems 菜单数据
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
    Menu.prototype.popup = function (menuItems) {
        var menuItem = this.handleShow({ submenu: menuItems });
        if (menuItem.submenu.length == 0)
            return;
        var menuUI = MenuUI.create(menuItem.submenu);
        Maskview_1.maskview.mask(menuUI);
    };
    /**
     * 处理菜单中 show==false的菜单项
     *
     * @param menuItem 菜单数据
     */
    Menu.prototype.handleShow = function (menuItem) {
        var _this = this;
        if (menuItem.submenu) {
            var submenu = menuItem.submenu.filter(function (v) { return v.show != false; });
            for (var i = submenu.length - 1; i >= 0; i--) {
                if (submenu[i].type == 'separator') {
                    if (i == 0 || i == submenu.length - 1) {
                        submenu.splice(i, 1);
                    }
                    else if (submenu[i - 1].type == 'separator') {
                        submenu.splice(i, 1);
                    }
                }
            }
            menuItem.submenu = submenu;
            menuItem.submenu.forEach(function (v) { return _this.handleShow(v); });
        }
        return menuItem;
    };
    /**
     * 弹出枚举选择菜单
     *
     * @param enumDefinition 枚举定义
     * @param currentValue 当前枚举值
     * @param selectCallBack 选择回调
     */
    Menu.prototype.popupEnum = function (enumDefinition, currentValue, selectCallBack) {
        var menu = [];
        for (var key in enumDefinition) {
            if (enumDefinition.hasOwnProperty(key)) {
                if (isNaN(Number(key))) {
                    menu.push({
                        label: (currentValue == enumDefinition[key] ? "√ " : "   ") + key,
                        click: (function (v) {
                            return function () { return selectCallBack(v); };
                        })(enumDefinition[key])
                    });
                }
            }
        }
        this.popup(menu);
    };
    return Menu;
}());
exports.Menu = Menu;
;
exports.menu = new Menu();
var MenuUI = /** @class */ (function (_super) {
    __extends(MenuUI, _super);
    function MenuUI() {
        var _this = _super.call(this) || this;
        _this.itemRenderer = MenuItemRenderer;
        _this.onComplete();
        return _this;
    }
    Object.defineProperty(MenuUI.prototype, "subMenuUI", {
        get: function () {
            return this._subMenuUI;
        },
        set: function (v) {
            if (this._subMenuUI)
                this._subMenuUI.remove();
            this._subMenuUI = v;
            if (this._subMenuUI)
                this._subMenuUI.parentMenuUI = this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuUI.prototype, "topMenu", {
        get: function () {
            var m = this.parentMenuUI ? this.parentMenuUI.topMenu : this;
            return m;
        },
        enumerable: true,
        configurable: true
    });
    MenuUI.create = function (menuItems, menuItemRendererRect) {
        if (menuItemRendererRect === void 0) { menuItemRendererRect = null; }
        var menuUI = new MenuUI();
        var dataProvider = new eui.ArrayCollection();
        dataProvider.replaceAll(menuItems);
        menuUI.dataProvider = dataProvider;
        editorui_1.editorui.popupLayer.addChild(menuUI);
        if (!menuItemRendererRect) {
            menuUI.x = feng3d.windowEventProxy.clientX;
            menuUI.y = feng3d.windowEventProxy.clientY;
            if (menuUI.x + menuUI.width > editorui_1.editorui.popupLayer.stage.stageWidth - 10)
                menuUI.x = editorui_1.editorui.popupLayer.stage.stageWidth - menuUI.width - 10;
        }
        else {
            menuUI.x = menuItemRendererRect.right;
            menuUI.y = menuItemRendererRect.top;
            if (menuUI.x + menuUI.width > editorui_1.editorui.popupLayer.stage.stageWidth) {
                menuUI.x = menuItemRendererRect.left - menuUI.width;
            }
        }
        if (menuUI.y + menuUI.height > editorui_1.editorui.popupLayer.stage.stageHeight)
            menuUI.y = editorui_1.editorui.popupLayer.stage.stageHeight - menuUI.height;
        return menuUI;
    };
    MenuUI.prototype.onComplete = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        if (this.stage) {
            this.onAddedToStage();
        }
    };
    MenuUI.prototype.onAddedToStage = function () {
        this.updateView();
    };
    MenuUI.prototype.onRemovedFromStage = function () {
        this.subMenuUI = null;
        this.parentMenuUI = null;
    };
    MenuUI.prototype.updateView = function () {
    };
    MenuUI.prototype.remove = function () {
        this.parent && this.parent.removeChild(this);
    };
    return MenuUI;
}(eui.List));
var MenuItemRenderer = /** @class */ (function (_super) {
    __extends(MenuItemRenderer, _super);
    function MenuItemRenderer() {
        var _this = _super.call(this) || this;
        _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "MenuItemRender";
        return _this;
    }
    MenuItemRenderer.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.updateView();
    };
    MenuItemRenderer.prototype.onComplete = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        if (this.stage) {
            this.onAddedToStage();
        }
    };
    MenuItemRenderer.prototype.onAddedToStage = function () {
        this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
        this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
        this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
        this.menuUI = this.parent;
        this.updateView();
    };
    MenuItemRenderer.prototype.onRemovedFromStage = function () {
        this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
        this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
        this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
        this.menuUI = null;
    };
    MenuItemRenderer.prototype.updateView = function () {
        if (!this.data)
            return;
        this.touchEnabled = true;
        this.touchChildren = true;
        if (this.data.type == 'separator') {
            this.skin.currentState = "separator";
            this.touchEnabled = false;
            this.touchChildren = false;
        }
        else {
            this.subSign.visible = (!!this.data.submenu && this.data.submenu.length > 0);
            this.skin.currentState = "normal";
        }
        this.subSign.textColor = this.label.textColor = this.data.enable != false ? 0x000000 : 0x6E6E6E;
        this.selectedRect.visible = false;
    };
    MenuItemRenderer.prototype.onItemMouseDown = function (event) {
        if (this.data.enable == false)
            return;
        if (this.data.click) {
            this.data.click();
            this.menuUI.topMenu.remove();
        }
    };
    MenuItemRenderer.prototype.onItemMouseOver = function () {
        if (this.data.submenu) {
            if (this.data.enable != false) {
                var rect = this.getTransformedBounds(this.stage);
                this.menuUI.subMenuUI = MenuUI.create(this.data.submenu, rect);
                this.menuUI.subMenuUI.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            }
        }
        else {
            this.menuUI.subMenuUI = null;
        }
        this.selectedRect.visible = this.data.enable != false;
    };
    MenuItemRenderer.prototype.onItemMouseOut = function () {
        if (!this.menuUI.subMenuUI)
            this.selectedRect.visible = false;
    };
    MenuItemRenderer.prototype.onsubMenuUIRemovedFromeStage = function (e) {
        var current = e.currentTarget;
        current.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
        this.selectedRect.visible = false;
    };
    return MenuItemRenderer;
}(eui.ItemRenderer));
//# sourceMappingURL=Menu.js.map