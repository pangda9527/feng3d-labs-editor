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
var editor;
(function (editor) {
    var MinMaxCurveVector3View = /** @class */ (function (_super) {
        __extends(MinMaxCurveVector3View, _super);
        function MinMaxCurveVector3View() {
            var _this = _super.call(this) || this;
            _this.minMaxCurveVector3 = new feng3d.MinMaxCurveVector3();
            _this.skinName = "MinMaxCurveVector3View";
            return _this;
        }
        MinMaxCurveVector3View.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.xMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
        };
        MinMaxCurveVector3View.prototype.$onRemoveFromStage = function () {
            this.xMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveVector3View.prototype.updateView = function () {
            if (!this.stage)
                return;
            this.xMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.xCurve;
            this.yMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.yCurve;
            this.zMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.zCurve;
        };
        MinMaxCurveVector3View.prototype._onMinMaxCurveVector3Changed = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveVector3View.prototype._onchanged = function () {
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveVector3Changed")
        ], MinMaxCurveVector3View.prototype, "minMaxCurveVector3", void 0);
        return MinMaxCurveVector3View;
    }(eui.Component));
    editor.MinMaxCurveVector3View = MinMaxCurveVector3View;
})(editor || (editor = {}));
//# sourceMappingURL=MinMaxCurveVector3View.js.map