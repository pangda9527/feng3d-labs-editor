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
var TreeItemRenderer_1 = require("../components/TreeItemRenderer");
var Drag_1 = require("../drag/Drag");
var Hierarchy_1 = require("../../feng3d/hierarchy/Hierarchy");
var EditorData_1 = require("../../global/EditorData");
var Menu_1 = require("../components/Menu");
var CommonConfig_1 = require("../../configs/CommonConfig");
var HierarchyTreeItemRenderer = /** @class */ (function (_super) {
    __extends(HierarchyTreeItemRenderer, _super);
    function HierarchyTreeItemRenderer() {
        var _this = _super.call(this) || this;
        _this.skinName = "HierarchyTreeItemRenderer";
        return _this;
    }
    HierarchyTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
        var _this = this;
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        Drag_1.drag.register(this, this.setdargSource.bind(this), ["gameobject", "file_gameobject", "file_script"], function (dragdata) {
            if (dragdata.gameobject) {
                if (!dragdata.gameobject.contains(_this.data.gameobject)) {
                    var localToWorldMatrix = dragdata.gameobject.transform.localToWorldMatrix;
                    _this.data.gameobject.addChild(dragdata.gameobject);
                    dragdata.gameobject.transform.localToWorldMatrix = localToWorldMatrix;
                }
            }
            if (dragdata.file_gameobject) {
                Hierarchy_1.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, _this.data.gameobject);
            }
            if (dragdata.file_script) {
                _this.data.gameobject.addScript(dragdata.file_script.scriptName);
            }
        });
        //
        this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
    };
    HierarchyTreeItemRenderer.prototype.$onRemoveFromStage = function () {
        Drag_1.drag.unregister(this);
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
    };
    HierarchyTreeItemRenderer.prototype.setdargSource = function (dragSource) {
        dragSource.gameobject = this.data.gameobject;
    };
    HierarchyTreeItemRenderer.prototype.onclick = function () {
        EditorData_1.editorData.selectObject(this.data.gameobject);
    };
    HierarchyTreeItemRenderer.prototype.onDoubleClick = function () {
        feng3d.shortcut.dispatch("lookToSelectedGameObject");
    };
    HierarchyTreeItemRenderer.prototype.onrightclick = function () {
        var _this = this;
        var menus = [];
        //scene3d无法删除
        if (this.data.gameobject.scene.gameObject != this.data.gameobject) {
            menus.push({
                label: "删除", click: function () {
                    _this.data.gameobject.parent.removeChild(_this.data.gameobject);
                }
            });
        }
        menus = menus.concat({ type: 'separator' }, CommonConfig_1.menuConfig.getCreateObjectMenu());
        if (menus.length > 0)
            Menu_1.menu.popup(menus);
    };
    return HierarchyTreeItemRenderer;
}(TreeItemRenderer_1.TreeItemRenderer));
exports.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
//# sourceMappingURL=HierarchyTreeItemRenderer.js.map