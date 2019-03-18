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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EditorRS_1 = require("../../assets/EditorRS");
var Menu_1 = require("../../ui/components/Menu");
var OAVCubeMap = /** @class */ (function (_super) {
    __extends(OAVCubeMap, _super);
    function OAVCubeMap(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.skinName = "OAVCubeMap";
        _this.alpha = 1;
        return _this;
    }
    OAVCubeMap.prototype.initView = function () {
        this.images = [this.px, this.py, this.pz, this.nx, this.ny, this.nz];
        this.btns = [this.pxBtn, this.pyBtn, this.pzBtn, this.nxBtn, this.nyBtn, this.nzBtn];
        // var param: { accepttype: keyof DragData; datatype?: string; } = { accepttype: "image" };
        for (var i = 0; i < propertys.length; i++) {
            this.updateImage(i);
            // drag.register(image,
            // 	(dragsource) => { },
            // 	[param.accepttype],
            // 	(dragSource) =>
            // 	{
            // 		this.attributeValue = dragSource[param.accepttype];
            // 	});
            this.btns[i].addEventListener(egret.MouseEvent.CLICK, this.onImageClick, this);
            this.btns[i].enabled = this._attributeViewInfo.editable;
            // this.btns[i].touchChildren = this.btns[i].touchEnabled = this._attributeViewInfo.editable;
        }
        this.addEventListener(egret.Event.RESIZE, this.onResize, this);
    };
    OAVCubeMap.prototype.updateImage = function (i) {
        var textureCube = this.space;
        var imagePath = textureCube[propertys[i]];
        var image = this.images[i];
        if (imagePath) {
            EditorRS_1.editorRS.fs.readArrayBuffer(imagePath, function (err, data) {
                feng3d.dataTransform.arrayBufferToDataURL(data, function (dataurl) {
                    image.source = dataurl;
                });
            });
        }
        else {
            image.source = null;
        }
    };
    OAVCubeMap.prototype.onImageClick = function (e) {
        var _this = this;
        var index = this.btns.indexOf(e.currentTarget);
        if (index != -1) {
            var textureCube = this.space;
            var texture2ds = feng3d.rs.getAssetDatasByType(feng3d.Texture2D);
            var menus = [{
                    label: "None", click: function () {
                        textureCube[propertys[index]] = "";
                        _this.updateImage(index);
                        _this.dispatchValueChange(index);
                    }
                }];
            texture2ds.forEach(function (d) {
                menus.push({
                    label: d.name, click: function () {
                        textureCube[propertys[index]] = d;
                        _this.updateImage(index);
                        _this.dispatchValueChange(index);
                    }
                });
            });
            Menu_1.menu.popup(menus);
        }
    };
    OAVCubeMap.prototype.dispatchValueChange = function (index) {
        var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
        objectViewEvent.space = this._space;
        objectViewEvent.attributeName = propertys[index];
        this.dispatchEvent(objectViewEvent);
    };
    OAVCubeMap.prototype.dispose = function () {
    };
    OAVCubeMap.prototype.updateView = function () {
    };
    OAVCubeMap.prototype.onResize = function () {
        var w4 = Math.round(this.width / 4);
        this.px.width = this.py.width = this.pz.width = this.nx.width = this.ny.width = this.nz.width = w4;
        this.px.height = this.py.height = this.pz.height = this.nx.height = this.ny.height = this.nz.height = w4;
        //
        this.pxGroup.width = this.pyGroup.width = this.pzGroup.width = this.nxGroup.width = this.nyGroup.width = this.nzGroup.width = w4;
        this.pxGroup.height = this.pyGroup.height = this.pzGroup.height = this.nxGroup.height = this.nyGroup.height = this.nzGroup.height = w4;
        //
        this.pxGroup.x = w4 * 2;
        this.pxGroup.y = w4;
        //
        this.pyGroup.x = w4;
        //
        this.pzGroup.x = w4;
        this.pzGroup.y = w4;
        //
        this.nxGroup.y = w4;
        //
        this.nyGroup.x = w4;
        this.nyGroup.y = w4 * 2;
        //
        this.nzGroup.x = w4 * 3;
        this.nzGroup.y = w4;
        //
        this.height = w4 * 3;
    };
    OAVCubeMap = __decorate([
        feng3d.OAVComponent()
    ], OAVCubeMap);
    return OAVCubeMap;
}(OAVBase));
exports.OAVCubeMap = OAVCubeMap;
var propertys = ["positive_x_url", "positive_y_url", "positive_z_url", "negative_x_url", "negative_y_url", "negative_z_url"];
//# sourceMappingURL=OAVCubeMap.js.map