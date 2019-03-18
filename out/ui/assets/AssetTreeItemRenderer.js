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
var EditorAsset_1 = require("./EditorAsset");
var EditorRS_1 = require("../../assets/EditorRS");
var TreeItemRenderer_1 = require("../components/TreeItemRenderer");
var AssetTreeItemRenderer = /** @class */ (function (_super) {
    __extends(AssetTreeItemRenderer, _super);
    function AssetTreeItemRenderer() {
        var _this = _super.call(this) || this;
        _this.skinName = "AssetTreeItemRenderer";
        return _this;
    }
    AssetTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        feng3d.watcher.watch(EditorAsset_1.editorAsset, "showFloder", this.showFloderChanged, this);
        this.showFloderChanged();
    };
    AssetTreeItemRenderer.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        feng3d.watcher.unwatch(EditorAsset_1.editorAsset, "showFloder", this.showFloderChanged, this);
    };
    AssetTreeItemRenderer.prototype.dataChanged = function () {
        var _this = this;
        _super.prototype.dataChanged.call(this);
        if (this.data) {
            var folder = this.data.asset;
            drag.register(this, function (dragsource) {
                dragsource.assetNodes = [_this.data];
            }, ["assetNodes"], function (dragdata) {
                dragdata.assetNodes.forEach(function (v) {
                    EditorRS_1.editorRS.moveAsset(v.asset, folder, function (err) {
                        if (!err) {
                            _this.data.addChild(v);
                        }
                        else {
                            alert(err.message);
                        }
                    });
                });
            });
        }
        else {
            drag.unregister(this);
        }
        this.showFloderChanged();
    };
    AssetTreeItemRenderer.prototype.showFloderChanged = function () {
        this.selected = this.data ? EditorAsset_1.editorAsset.showFloder == this.data : false;
    };
    AssetTreeItemRenderer.prototype.onclick = function () {
        EditorAsset_1.editorAsset.showFloder = this.data;
    };
    AssetTreeItemRenderer.prototype.onrightclick = function (e) {
        if (this.data.parent != null) {
            EditorAsset_1.editorAsset.popupmenu(this.data);
        }
        else {
            EditorAsset_1.editorAsset.popupmenu(this.data);
        }
    };
    return AssetTreeItemRenderer;
}(TreeItemRenderer_1.TreeItemRenderer));
exports.AssetTreeItemRenderer = AssetTreeItemRenderer;
//# sourceMappingURL=AssetTreeItemRenderer.js.map