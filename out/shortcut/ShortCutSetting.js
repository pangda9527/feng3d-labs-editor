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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 快捷键设置界面
     */
    var ShortCutSetting = /** @class */ (function (_super) {
        __extends(ShortCutSetting, _super);
        function ShortCutSetting() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ShortCutSetting";
            return _this;
        }
        ShortCutSetting.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        ShortCutSetting.prototype.onAddedToStage = function () {
            this.searchTxt.addEventListener(egret.Event.CHANGE, this.updateView, this);
            this.updateView();
        };
        ShortCutSetting.prototype.onRemovedFromStage = function () {
            this.searchTxt.removeEventListener(egret.Event.CHANGE, this.updateView, this);
        };
        ShortCutSetting.prototype.updateView = function () {
            var text = this.searchTxt.text;
            var reg = new RegExp(text, "i");
            var data = shortcutConfig.filter(function (v) {
                for (var key in v) {
                    if (key.charAt(0) != "_") {
                        if (typeof v[key] == "string" && v[key].search(reg) != -1)
                            return true;
                    }
                }
                return false;
            });
            this.list.dataProvider = new eui.ArrayCollection(data);
        };
        Object.defineProperty(ShortCutSetting, "instance", {
            get: function () {
                return this["_instance"] = this["_instance"] || new ShortCutSetting();
            },
            enumerable: true,
            configurable: true
        });
        return ShortCutSetting;
    }(eui.Component));
    exports.ShortCutSetting = ShortCutSetting;
});
//# sourceMappingURL=ShortCutSetting.js.map