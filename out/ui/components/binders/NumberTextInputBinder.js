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
define(["require", "exports", "./TextInputBinder"], function (require, exports, TextInputBinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberTextInputBinder = /** @class */ (function (_super) {
        __extends(NumberTextInputBinder, _super);
        function NumberTextInputBinder() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 步长，精度
             */
            _this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            _this.stepDownup = 0.001;
            /**
             * 移动一个像素时增加的步长数量
             */
            _this.stepScale = 1;
            /**
             * 最小值
             */
            _this.minValue = NaN;
            /**
             * 最小值
             */
            _this.maxValue = NaN;
            _this.toText = function (v) {
                // 消除数字显示为类似 0.0000000001 的问题
                var fractionDigits = 1;
                while (fractionDigits * this.step < 1) {
                    fractionDigits *= 10;
                }
                var text = String(Math.round(fractionDigits * (Math.round(v / this.step) * this.step)) / fractionDigits);
                return text;
            };
            _this.toValue = function (v) {
                var n = Number(v) || 0;
                return n;
            };
            _this.mouseDownPosition = new feng3d.Vector2();
            _this.mouseDownValue = 0;
            return _this;
        }
        NumberTextInputBinder.prototype.initView = function () {
            _super.prototype.initView.call(this);
            if (this.editable) {
                // feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
                this.controller && this.controller.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
        };
        NumberTextInputBinder.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            // feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            this.controller && this.controller.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        };
        NumberTextInputBinder.prototype.onValueChanged = function () {
            var value = this.space[this.attribute];
            if (!isNaN(this.minValue)) {
                value = Math.max(this.minValue, value);
            }
            if (!isNaN(this.maxValue)) {
                value = Math.min(this.maxValue, value);
            }
            this.space[this.attribute] = value;
            _super.prototype.onValueChanged.call(this);
        };
        NumberTextInputBinder.prototype.onMouseDown = function (e) {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            feng3d.shortcut.activityState("disableScroll");
            //
            this.mouseDownPosition = mousePos;
            this.mouseDownValue = this.space[this.attribute];
            //
            feng3d.windowEventProxy.on("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        };
        NumberTextInputBinder.prototype.onStageMouseMove = function () {
            this.space[this.attribute] = this.mouseDownValue + ((feng3d.windowEventProxy.clientX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - feng3d.windowEventProxy.clientY)) * this.step * this.stepScale;
        };
        NumberTextInputBinder.prototype.onStageMouseUp = function () {
            feng3d.windowEventProxy.off("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);
            feng3d.shortcut.deactivityState("disableScroll");
        };
        NumberTextInputBinder.prototype.ontxtfocusin = function () {
            _super.prototype.ontxtfocusin.call(this);
            feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
        };
        NumberTextInputBinder.prototype.ontxtfocusout = function () {
            _super.prototype.ontxtfocusout.call(this);
            feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
        };
        NumberTextInputBinder.prototype.onWindowKeyDown = function (event) {
            if (event.key == "ArrowUp") {
                this.space[this.attribute] += this.step;
            }
            else if (event.key == "ArrowDown") {
                this.space[this.attribute] -= this.step;
            }
        };
        return NumberTextInputBinder;
    }(TextInputBinder_1.TextInputBinder));
    exports.NumberTextInputBinder = NumberTextInputBinder;
});
//# sourceMappingURL=NumberTextInputBinder.js.map