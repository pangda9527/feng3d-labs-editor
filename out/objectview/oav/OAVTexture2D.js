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
define(["require", "exports", "./OAVBase", "../../ui/components/Menu"], function (require, exports, OAVBase_1, Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 挑选（拾取）OAV界面
     */
    var OAVTexture2D = /** @class */ (function (_super) {
        __extends(OAVTexture2D, _super);
        function OAVTexture2D(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVTexture2D";
            return _this;
        }
        OAVTexture2D.prototype.initView = function () {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable)
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVTexture2D.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        };
        OAVTexture2D.prototype.ontxtClick = function () {
            var _this = this;
            var menus = [];
            var texture2ds = feng3d.rs.getAssetDatasByType(feng3d.Texture2D);
            texture2ds.forEach(function (texture2d) {
                menus.push({
                    label: texture2d.name, click: function () {
                        _this.attributeValue = texture2d;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    }
                });
            });
            Menu_1.menu.popup(menus);
        };
        /**
         * 更新界面
         */
        OAVTexture2D.prototype.updateView = function () {
            var texture = this.attributeValue;
            this.image.source = texture.dataURL;
        };
        OAVTexture2D.prototype.onDoubleClick = function () {
            if (this.attributeValue && typeof this.attributeValue == "object")
                feng3d.dispatcher.dispatch("inspector.showData", this.attributeValue);
        };
        OAVTexture2D = __decorate([
            feng3d.OAVComponent()
        ], OAVTexture2D);
        return OAVTexture2D;
    }(OAVBase_1.OAVBase));
    exports.OAVTexture2D = OAVTexture2D;
});
//# sourceMappingURL=OAVTexture2D.js.map