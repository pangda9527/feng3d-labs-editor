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
define(["require", "exports", "./ColorPickerView", "./Popupview"], function (require, exports, ColorPickerView_1, Popupview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorPicker = /** @class */ (function (_super) {
        __extends(ColorPicker, _super);
        function ColorPicker() {
            var _this = _super.call(this) || this;
            _this._value = new feng3d.Color3();
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ColorPicker";
            return _this;
        }
        Object.defineProperty(ColorPicker.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
                if (this.picker) {
                    if (this._value instanceof feng3d.Color3) {
                        this.picker.fillColor = this._value.toInt();
                    }
                    else {
                        this.picker.fillColor = this._value.toColor3().toInt();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ColorPicker.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        ColorPicker.prototype.onAddedToStage = function () {
            this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ColorPicker.prototype.onRemovedFromStage = function () {
            this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ColorPicker.prototype.onClick = function () {
            var _this = this;
            ColorPickerView_1.colorPickerView.color = this.value;
            var pos = this.localToGlobal(0, 0);
            // pos.x = pos.x - colorPickerView.width;
            pos.x = pos.x - 318;
            ColorPickerView_1.colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            //
            Popupview_1.popupview.popupView(ColorPickerView_1.colorPickerView, function () {
                ColorPickerView_1.colorPickerView.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
            }, pos.x, pos.y);
        };
        ColorPicker.prototype.onPickerViewChanged = function () {
            this.value = ColorPickerView_1.colorPickerView.color;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        return ColorPicker;
    }(eui.Component));
    exports.ColorPicker = ColorPicker;
});
//# sourceMappingURL=ColorPicker.js.map