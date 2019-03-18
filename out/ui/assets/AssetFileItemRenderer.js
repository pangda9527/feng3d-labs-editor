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
var Drag_1 = require("../drag/Drag");
var EditorData_1 = require("../../global/EditorData");
var EditorRS_1 = require("../../assets/EditorRS");
var EditorAsset_1 = require("./EditorAsset");
var Main3D_1 = require("../../feng3d/Main3D");
var AssetFileItemRenderer = /** @class */ (function (_super) {
    __extends(AssetFileItemRenderer, _super);
    function AssetFileItemRenderer() {
        var _this = _super.call(this) || this;
        _this.itemSelected = false;
        _this.skinName = "AssetFileItemRenderer";
        return _this;
    }
    AssetFileItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
        this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        this.selectedfilechanged();
    };
    AssetFileItemRenderer.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        feng3d.dispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
    };
    AssetFileItemRenderer.prototype.dataChanged = function () {
        var _this = this;
        _super.prototype.dataChanged.call(this);
        if (this.data) {
            if (this.data.isDirectory) {
                var folder = this.data.asset;
                Drag_1.drag.register(this, function (dragsource) {
                    if (EditorData_1.editorData.selectedAssetNodes.indexOf(_this.data) != -1) {
                        dragsource.assetNodes = EditorData_1.editorData.selectedAssetNodes.concat();
                    }
                    else {
                        dragsource.assetNodes = [_this.data];
                    }
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
                if (!this.data.isLoaded) {
                    var data = this.data;
                    data.load(function () {
                        feng3d.assert(data.isLoaded);
                        if (data == _this.data)
                            _this.dataChanged();
                    });
                    return;
                }
                Drag_1.drag.register(this, function (dragsource) {
                    var extension = _this.data.asset.assetType;
                    switch (extension) {
                        case feng3d.AssetType.gameobject:
                            dragsource.file_gameobject = feng3d.serialization.clone(_this.data.asset.data);
                            break;
                        case feng3d.AssetType.script:
                            dragsource.file_script = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.anim:
                            dragsource.animationclip = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.material:
                            dragsource.material = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.texturecube:
                            dragsource.texturecube = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.geometry:
                            dragsource.geometry = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.texture:
                            dragsource.texture2d = _this.data.asset.data;
                            break;
                        case feng3d.AssetType.audio:
                            dragsource.audio = _this.data.asset.data;
                            break;
                    }
                    if (EditorData_1.editorData.selectedAssetNodes.indexOf(_this.data) != -1) {
                        dragsource.assetNodes = EditorData_1.editorData.selectedAssetNodes.concat();
                    }
                    else {
                        dragsource.assetNodes = [_this.data];
                    }
                }, []);
            }
        }
        else {
            Drag_1.drag.unregister(this);
        }
        this.selectedfilechanged();
    };
    AssetFileItemRenderer.prototype.ondoubleclick = function () {
        if (this.data.isDirectory) {
            EditorAsset_1.editorAsset.showFloder = this.data;
        }
        else if (this.data.asset instanceof feng3d.GameObject) {
            var scene = this.data.asset.getComponent(feng3d.Scene3D);
            if (scene) {
                Main3D_1.engine.scene = scene;
            }
        }
    };
    AssetFileItemRenderer.prototype.onclick = function () {
        // 处理按下shift键时
        var isShift = feng3d.shortcut.keyState.getKeyState("shift");
        if (isShift) {
            var source = this.parent.dataProvider.source;
            var index = source.indexOf(this.data);
            var min = index, max = index;
            if (EditorData_1.editorData.selectedAssetNodes.indexOf(preAssetFile) != -1) {
                index = source.indexOf(preAssetFile);
                if (index < min)
                    min = index;
                if (index > max)
                    max = index;
            }
            EditorData_1.editorData.selectMultiObject(source.slice(min, max + 1));
        }
        else {
            EditorData_1.editorData.selectObject(this.data);
            preAssetFile = this.data;
        }
    };
    AssetFileItemRenderer.prototype.onrightclick = function (e) {
        e.stopPropagation();
        EditorData_1.editorData.selectObject(this.data);
        EditorAsset_1.editorAsset.popupmenu(this.data);
    };
    AssetFileItemRenderer.prototype.selectedfilechanged = function () {
        var selectedAssetFile = EditorData_1.editorData.selectedAssetNodes;
        var selected = this.data ? selectedAssetFile.indexOf(this.data) != -1 : false;
        if (this.itemSelected != selected) {
            this.itemSelected = selected;
        }
    };
    return AssetFileItemRenderer;
}(eui.ItemRenderer));
exports.AssetFileItemRenderer = AssetFileItemRenderer;
var preAssetFile;
//# sourceMappingURL=AssetFileItemRenderer.js.map