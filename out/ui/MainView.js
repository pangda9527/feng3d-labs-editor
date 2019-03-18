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
var MainView = /** @class */ (function (_super) {
    __extends(MainView, _super);
    function MainView() {
        var _this = _super.call(this) || this;
        _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "MainViewSkin";
        return _this;
    }
    MainView.prototype.onComplete = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        if (this.stage) {
            this.onAddedToStage();
        }
    };
    MainView.prototype.onAddedToStage = function () {
    };
    MainView.prototype.onRemovedFromStage = function () {
    };
    return MainView;
}(eui.Component));
exports.MainView = MainView;
//# sourceMappingURL=MainView.js.map