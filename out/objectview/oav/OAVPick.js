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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./OAVBase", "../../ui/drag/Drag", "../../ui/components/Menu", "../../assets/EditorRS"], function (require, exports, OAVBase_1, Drag_1, Menu_1, EditorRS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 挑选（拾取）OAV界面
     */
    var OAVPick = /** @class */ (function (_super) {
        __extends(OAVPick, _super);
        function OAVPick(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVPick";
            return _this;
        }
        OAVPick.prototype.initView = function () {
            var _this = this;
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable) {
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
                var param = this._attributeViewInfo.componentParam;
                Drag_1.drag.register(this, function (dragsource) {
                    if (param.datatype)
                        dragsource[param.datatype] = _this.attributeValue;
                }, [param.accepttype], function (dragSource) {
                    _this.attributeValue = dragSource[param.accepttype];
                });
            }
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVPick.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
            Drag_1.drag.unregister(this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        };
        OAVPick.prototype.onPickBtnClick = function () {
            var _this = this;
            var param = this._attributeViewInfo.componentParam;
            if (param.accepttype) {
                if (param.accepttype == "texture2d") {
                    var menus = [];
                    var texture2ds = EditorRS_1.editorRS.getAssetDatasByType(feng3d.Texture2D);
                    texture2ds.forEach(function (item) {
                        menus.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item;
                            }
                        });
                    });
                    Menu_1.menu.popup(menus);
                }
                else if (param.accepttype == "texturecube") {
                    var menus = [];
                    var textureCubes = EditorRS_1.editorRS.getAssetDatasByType(feng3d.TextureCube);
                    textureCubes.forEach(function (item) {
                        menus.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item;
                            }
                        });
                    });
                    Menu_1.menu.popup(menus);
                }
                else if (param.accepttype == "audio") {
                    var menus = [{ label: "None", click: function () { _this.attributeValue = ""; } }];
                    var audioFiles = EditorRS_1.editorRS.getAssetsByType(feng3d.AudioAsset);
                    audioFiles.forEach(function (item) {
                        menus.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item.assetPath;
                            }
                        });
                    }, []);
                    Menu_1.menu.popup(menus);
                }
                else if (param.accepttype == "file_script") {
                    var scriptFiles = EditorRS_1.editorRS.getAssetsByType(feng3d.ScriptAsset);
                    var menus = [{ label: "None", click: function () { _this.attributeValue = null; } }];
                    scriptFiles.forEach(function (element) {
                        menus.push({
                            label: element.scriptName,
                            click: function () {
                                _this.attributeValue = element.scriptName;
                            }
                        });
                    });
                    Menu_1.menu.popup(menus);
                }
                else if (param.accepttype == "material") {
                    var assets = EditorRS_1.editorRS.getAssetDatasByType(feng3d.Material);
                    var menus = [];
                    assets.forEach(function (element) {
                        menus.push({
                            label: element.name,
                            click: function () {
                                _this.attributeValue = element;
                            }
                        });
                    });
                    Menu_1.menu.popup(menus);
                }
                else if (param.accepttype == "geometry") {
                    var geometrys = EditorRS_1.editorRS.getAssetDatasByType(feng3d.Geometry);
                    var menus = [];
                    geometrys.forEach(function (element) {
                        menus.push({
                            label: element.name,
                            click: function () {
                                _this.attributeValue = element;
                            }
                        });
                    });
                    Menu_1.menu.popup(menus);
                }
            }
        };
        /**
         * 更新界面
         */
        OAVPick.prototype.updateView = function () {
            if (this.attributeValue === undefined) {
                this.text.text = String(this.attributeValue);
            }
            else if (!(this.attributeValue instanceof Object)) {
                this.text.text = String(this.attributeValue);
            }
            else {
                this.text.text = this.attributeValue["name"] || "";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
        };
        OAVPick.prototype.onDoubleClick = function () {
            if (this.attributeValue && typeof this.attributeValue == "object")
                feng3d.dispatcher.dispatch("inspector.showData", this.attributeValue);
        };
        OAVPick = __decorate([
            feng3d.OAVComponent()
        ], OAVPick);
        return OAVPick;
    }(OAVBase_1.OAVBase));
    exports.OAVPick = OAVPick;
});
//# sourceMappingURL=OAVPick.js.map