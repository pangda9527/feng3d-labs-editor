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
var HierarchyTreeItemRenderer_1 = require("./HierarchyTreeItemRenderer");
var Hierarchy_1 = require("../../feng3d/hierarchy/Hierarchy");
var EditorData_1 = require("../../global/EditorData");
var Menu_1 = require("../components/Menu");
var CommonConfig_1 = require("../../configs/CommonConfig");
var HierarchyView = /** @class */ (function (_super) {
    __extends(HierarchyView, _super);
    function HierarchyView() {
        var _this = _super.call(this) || this;
        _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "HierarchyViewSkin";
        return _this;
    }
    HierarchyView.prototype.onComplete = function () {
        this.list.itemRenderer = HierarchyTreeItemRenderer_1.HierarchyTreeItemRenderer;
        this.hierachyScroller.viewport = this.list;
        this.listData = this.list.dataProvider = new eui.ArrayCollection();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        if (this.stage) {
            this.onAddedToStage();
        }
    };
    HierarchyView.prototype.onAddedToStage = function () {
        this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
        this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
        feng3d.watcher.watch(Hierarchy_1.hierarchy, "rootnode", this.onRootNodeChanged, this);
        this.onRootNode(Hierarchy_1.hierarchy.rootnode);
        this.invalidHierarchy();
    };
    HierarchyView.prototype.onRemovedFromStage = function () {
        this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
        this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
        feng3d.watcher.unwatch(Hierarchy_1.hierarchy, "rootnode", this.onRootNodeChanged, this);
        this.offRootNode(Hierarchy_1.hierarchy.rootnode);
    };
    HierarchyView.prototype.onRootNodeChanged = function (host, property, oldvalue) {
        this.offRootNode(oldvalue);
        this.onRootNode(Hierarchy_1.hierarchy.rootnode);
    };
    HierarchyView.prototype.onRootNode = function (node) {
        if (node) {
            node.on("added", this.invalidHierarchy, this);
            node.on("removed", this.invalidHierarchy, this);
            node.on("openChanged", this.invalidHierarchy, this);
        }
    };
    HierarchyView.prototype.offRootNode = function (node) {
        if (node) {
            node.off("added", this.invalidHierarchy, this);
            node.off("removed", this.invalidHierarchy, this);
            node.off("openChanged", this.invalidHierarchy, this);
        }
    };
    HierarchyView.prototype.invalidHierarchy = function () {
        feng3d.ticker.nextframe(this.updateHierarchyTree, this);
    };
    HierarchyView.prototype.updateHierarchyTree = function () {
        var nodes = Hierarchy_1.hierarchy.rootnode.getShowNodes();
        this.listData.replaceAll(nodes);
    };
    HierarchyView.prototype.onListClick = function (e) {
        if (e.target == this.list) {
            EditorData_1.editorData.selectObject(null);
        }
    };
    HierarchyView.prototype.onListRightClick = function (e) {
        if (e.target == this.list) {
            EditorData_1.editorData.selectObject(null);
            Menu_1.menu.popup(CommonConfig_1.menuConfig.getCreateObjectMenu());
        }
    };
    return HierarchyView;
}(eui.Component));
exports.HierarchyView = HierarchyView;
//# sourceMappingURL=HierarchyView.js.map