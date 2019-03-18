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
var OAVBase_1 = require("./OAVBase");
var OAVImage = /** @class */ (function (_super) {
    __extends(OAVImage, _super);
    function OAVImage(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.skinName = "OAVImage";
        _this.alpha = 1;
        return _this;
    }
    OAVImage.prototype.initView = function () {
        var texture = this.space;
        this.image.source = texture.dataURL;
        this.addEventListener(egret.Event.RESIZE, this.onResize, this);
    };
    OAVImage.prototype.dispose = function () {
    };
    OAVImage.prototype.updateView = function () {
    };
    OAVImage.prototype.onResize = function () {
        this.image.width = this.width;
        this.image.height = this.width;
        this.height = this.width;
    };
    OAVImage = __decorate([
        feng3d.OAVComponent()
    ], OAVImage);
    return OAVImage;
}(OAVBase_1.OAVBase));
exports.OAVImage = OAVImage;
//# sourceMappingURL=OAVImage.js.map