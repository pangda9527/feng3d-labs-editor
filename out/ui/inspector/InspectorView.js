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
var AssetNode_1 = require("../assets/AssetNode");
var EditorRS_1 = require("../../assets/EditorRS");
var EditorAsset_1 = require("../assets/EditorAsset");
var EditorData_1 = require("../../global/EditorData");
var InspectorMultiObject_1 = require("./InspectorMultiObject");
/**
 * 属性面板（检查器）
 */
var InspectorView = /** @class */ (function (_super) {
    __extends(InspectorView, _super);
    function InspectorView() {
        var _this = _super.call(this) || this;
        _this._viewDataList = [];
        _this._dataChanged = false;
        _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "InspectorViewSkin";
        feng3d.dispatcher.on("inspector.update", _this.updateView, _this);
        feng3d.dispatcher.on("inspector.showData", _this.onShowData, _this);
        feng3d.dispatcher.on("inspector.saveShowData", _this.onSaveShowData, _this);
        return _this;
    }
    InspectorView.prototype.showData = function (data, removeBack) {
        if (removeBack === void 0) { removeBack = false; }
        if (this._viewData == data)
            return;
        if (this._viewData) {
            this.saveShowData();
            this._viewDataList.push(this._viewData);
        }
        if (removeBack) {
            this._viewDataList.length = 0;
        }
        //
        this._viewData = data;
        this.updateView();
    };
    InspectorView.prototype.onShowData = function (event) {
        this.showData(event.data);
    };
    InspectorView.prototype.onSaveShowData = function (event) {
        this.saveShowData(event.data);
    };
    InspectorView.prototype.updateView = function () {
        var _this = this;
        this.typeLab.text = "Inspector";
        this.backButton.visible = this._viewDataList.length > 0;
        if (this._view && this._view.parent) {
            this._view.parent.removeChild(this._view);
        }
        if (this._viewData) {
            if (this._viewData instanceof AssetNode_1.AssetNode) {
                if (this._viewData.isDirectory)
                    return;
                if (this._viewData.asset) {
                    this.updateShowData(this._viewData.asset);
                }
                else {
                    if (!this._viewData.isLoaded) {
                        var viewData = this._viewData;
                        viewData.load(function () {
                            feng3d.assert(!!viewData.asset);
                            if (viewData == _this._viewData)
                                _this.updateShowData(viewData.asset);
                        });
                    }
                }
            }
            else {
                this.updateShowData(this._viewData);
            }
        }
    };
    /**
     * 保存显示数据
     */
    InspectorView.prototype.saveShowData = function (callback) {
        if (this._dataChanged) {
            if (this._viewData.assetId) {
                var feng3dAsset = feng3d.rs.getAsset(this._viewData.assetId);
                if (feng3dAsset) {
                    EditorRS_1.editorRS.writeAsset(feng3dAsset, function (err) {
                        feng3d.assert(!err, "\u8D44\u6E90 " + feng3dAsset.assetId + " \u4FDD\u5B58\u5931\u8D25\uFF01");
                        callback && callback();
                    });
                }
            }
            else if (this._viewData instanceof AssetNode_1.AssetNode) {
                EditorAsset_1.editorAsset.saveAsset(this._viewData);
            }
            this._dataChanged = false;
        }
        else {
            callback && callback();
        }
    };
    InspectorView.prototype.onComplete = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        if (this.stage) {
            this.onAddedToStage();
        }
    };
    InspectorView.prototype.onAddedToStage = function () {
        this.backButton.visible = this._viewDataList.length > 0;
        this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
    };
    InspectorView.prototype.onRemovedFromStage = function () {
        this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
        feng3d.dispatcher.off("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
    };
    InspectorView.prototype.onSelectedObjectsChanged = function () {
        var data = InspectorMultiObject_1.inspectorMultiObject.convertInspectorObject(EditorData_1.editorData.selectedObjects);
        this.showData(data, true);
    };
    InspectorView.prototype.updateShowData = function (showdata) {
        this.typeLab.text = "Inspector - " + showdata.constructor["name"];
        if (this._view)
            this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
        var editable = true;
        if (showdata instanceof feng3d.Feng3dObject)
            editable = !Boolean(showdata.hideFlags & feng3d.HideFlags.NotEditable);
        this._view = feng3d.objectview.getObjectView(showdata, { editable: editable });
        // this._view.percentWidth = 100;
        this.group.addChild(this._view);
        this.group.scrollV = 0;
        this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
    };
    InspectorView.prototype.onValueChanged = function (e) {
        this._dataChanged = true;
        if (this._viewData instanceof feng3d.FileAsset) {
            if (this._viewData.assetId) {
                var assetNode = EditorAsset_1.editorAsset.getAssetByID(this._viewData.assetId);
                assetNode && assetNode.updateImage();
            }
        }
        else if (this._viewData instanceof AssetNode_1.AssetNode) {
            this._viewData.updateImage();
        }
    };
    InspectorView.prototype.onBackButton = function () {
        this._viewData = this._viewDataList.pop();
        this.updateView();
    };
    return InspectorView;
}(eui.Component));
exports.InspectorView = InspectorView;
//# sourceMappingURL=InspectorView.js.map