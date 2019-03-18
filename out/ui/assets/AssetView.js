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
define(["require", "exports", "../../global/editorui", "./EditorAsset", "../../global/EditorData", "../components/AreaSelectRect", "./AssetTreeItemRenderer", "./AssetFileItemRenderer", "../drag/Drag"], function (require, exports, editorui_1, EditorAsset_1, EditorData_1, AreaSelectRect_1, AssetTreeItemRenderer_1, AssetFileItemRenderer_1, Drag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetView = /** @class */ (function (_super) {
        __extends(AssetView, _super);
        function AssetView() {
            var _this = _super.call(this) || this;
            //
            _this._assettreeInvalid = true;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "AssetView";
            editorui_1.editorui.assetview = _this;
            _this.fileDrag = new FileDrag(_this);
            return _this;
        }
        AssetView.prototype.onComplete = function () {
            this.assetTreeList.itemRenderer = AssetTreeItemRenderer_1.AssetTreeItemRenderer;
            this.filelist.itemRenderer = AssetFileItemRenderer_1.AssetFileItemRenderer;
            this.floderScroller.viewport = this.filelist;
            this.assetTreeScroller.viewport = this.assetTreeList;
            this.listData = this.assetTreeList.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        };
        AssetView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.excludeTxt.text = "";
            this.filepathLabel.text = "";
            //
            Drag_1.drag.register(this.filelistgroup, function (dragsource) { }, ["gameobject"], function (dragSource) {
                if (dragSource.gameobject) {
                    var gameobject = feng3d.serialization.clone(dragSource.gameobject);
                    EditorAsset_1.editorAsset.saveObject(gameobject);
                }
            });
            this.initlist();
            //
            this.fileDrag.addEventListener();
            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        };
        AssetView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.watcher.unwatch(EditorAsset_1.editorAsset, "showFloder", this.updateShowFloder, this);
            feng3d.dispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            //
            Drag_1.drag.unregister(this.filelistgroup);
            this.fileDrag.removeEventListener();
        };
        AssetView.prototype.initlist = function () {
            var _this = this;
            EditorAsset_1.editorAsset.initproject(function () {
                _this.invalidateAssettree();
                EditorAsset_1.editorAsset.rootFile.on("openChanged", _this.invalidateAssettree, _this);
                EditorAsset_1.editorAsset.rootFile.on("added", _this.invalidateAssettree, _this);
                EditorAsset_1.editorAsset.rootFile.on("removed", _this.invalidateAssettree, _this);
                feng3d.watcher.watch(EditorAsset_1.editorAsset, "showFloder", _this.updateShowFloder, _this);
            });
        };
        AssetView.prototype.update = function () {
            if (this._assettreeInvalid) {
                this.updateAssetTree();
                this.updateShowFloder();
                this._assettreeInvalid = false;
            }
        };
        AssetView.prototype.invalidateAssettree = function () {
            this._assettreeInvalid = true;
            feng3d.ticker.nextframe(this.update, this);
        };
        AssetView.prototype.updateAssetTree = function () {
            var folders = EditorAsset_1.editorAsset.rootFile.getFolderList();
            this.listData.replaceAll(folders);
        };
        AssetView.prototype.updateShowFloder = function (host, property, oldvalue) {
            var _this = this;
            var floder = EditorAsset_1.editorAsset.showFloder;
            if (!floder)
                return;
            var textFlow = new Array();
            do {
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floder.label, style: { "href": "event:" + floder.asset.assetId } });
                floder = floder.parent;
            } while (floder);
            this.floderpathTxt.textFlow = textFlow;
            var children = EditorAsset_1.editorAsset.showFloder.children;
            try {
                var excludeReg = new RegExp(this.excludeTxt.text);
            }
            catch (error) {
                excludeReg = new RegExp("");
            }
            try {
                var includeReg = new RegExp(this.includeTxt.text);
            }
            catch (error) {
                includeReg = new RegExp("");
            }
            var fileinfos = children.filter(function (value) {
                if (_this.includeTxt.text) {
                    if (!includeReg.test(value.label))
                        return false;
                }
                if (_this.excludeTxt.text) {
                    if (excludeReg.test(value.label))
                        return false;
                }
                return true;
            });
            var nodes = fileinfos.map(function (value) { return value; });
            nodes = nodes.sort(function (a, b) {
                if (a.isDirectory > b.isDirectory)
                    return -1;
                if (a.isDirectory < b.isDirectory)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 1;
            });
            this.filelistData.replaceAll(nodes);
            this.filelist.scrollV = 0;
            this.selectedfilechanged();
        };
        AssetView.prototype.onfilter = function () {
            this.updateShowFloder();
        };
        AssetView.prototype.selectedfilechanged = function () {
            var selectedAssetFile = EditorData_1.editorData.selectedAssetNodes;
            if (selectedAssetFile.length > 0)
                this.filepathLabel.text = selectedAssetFile.map(function (v) {
                    return v.asset.name + v.asset.extenson;
                }).join(",");
            else
                this.filepathLabel.text = "";
        };
        AssetView.prototype.onfilelistclick = function (e) {
            if (e.target == this.filelist) {
                EditorData_1.editorData.clearSelectedObjects();
            }
        };
        AssetView.prototype.onfilelistrightclick = function (e) {
            EditorData_1.editorData.clearSelectedObjects();
            EditorAsset_1.editorAsset.popupmenu(EditorAsset_1.editorAsset.showFloder);
        };
        AssetView.prototype.onfloderpathTxtLink = function (evt) {
            EditorAsset_1.editorAsset.showFloder = EditorAsset_1.editorAsset.getAssetByID(evt.text);
        };
        AssetView.prototype.onMouseDown = function (e) {
            if (e.target != this.filelist)
                return;
            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        };
        AssetView.prototype.onMouseMove = function () {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var p = this.filelist.localToGlobal(0, 0);
            var rectangle = new feng3d.Rectangle(p.x, p.y, this.filelist.width, this.filelist.height);
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            AreaSelectRect_1.areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
            //
            var min = this.areaSelectStartPosition.clone().min(areaSelectEndPosition);
            var max = this.areaSelectStartPosition.clone().max(areaSelectEndPosition);
            var areaRect = new feng3d.Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
            //
            var datas = this.filelist.$indexToRenderer.filter(function (v) {
                var p = v.localToGlobal(0, 0);
                var rectangle = new feng3d.Rectangle(p.x, p.y, v.width, v.height);
                return areaRect.intersects(rectangle);
            }).map(function (v) { return v.data; });
            EditorData_1.editorData.selectMultiObject(datas);
        };
        AssetView.prototype.onMouseUp = function () {
            AreaSelectRect_1.areaSelectRect.hide();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        return AssetView;
    }(eui.Component));
    exports.AssetView = AssetView;
    var FileDrag = /** @class */ (function () {
        function FileDrag(displayobject) {
            this.addEventListener = function () {
                document.addEventListener("dragenter", dragenter, false);
                document.addEventListener("dragover", dragover, false);
                document.addEventListener("drop", drop, false);
            };
            this.removeEventListener = function () {
                document.removeEventListener("dragenter", dragenter, false);
                document.removeEventListener("dragover", dragover, false);
                document.removeEventListener("drop", drop, false);
            };
            function dragenter(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function dragover(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function drop(e) {
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                var fileList = dt.files;
                var files = [];
                for (var i = 0; i < fileList.length; i++) {
                    files[i] = fileList[i];
                }
                if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY)) {
                    EditorAsset_1.editorAsset.inputFiles(files);
                }
            }
        }
        return FileDrag;
    }());
});
//# sourceMappingURL=AssetView.js.map