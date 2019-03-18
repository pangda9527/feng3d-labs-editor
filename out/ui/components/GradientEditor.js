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
var NumberSliderTextInputBinder_1 = require("./binders/NumberSliderTextInputBinder");
var NumberTextInputBinder_1 = require("./binders/NumberTextInputBinder");
var GradientEditor = /** @class */ (function (_super) {
    __extends(GradientEditor, _super);
    function GradientEditor() {
        var _this = _super.call(this) || this;
        _this.gradient = new feng3d.Gradient();
        _this.skinName = "GradientEditor";
        return _this;
    }
    GradientEditor.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.updateView();
        this.alphaLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
        this.colorLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
        this.colorPicker.addEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
        this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
        this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
    };
    GradientEditor.prototype.$onRemoveFromStage = function () {
        this.alphaLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
        this.colorLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
        this.colorPicker.removeEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
        this.modeCB.removeEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
        this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
        _super.prototype.$onRemoveFromStage.call(this);
    };
    GradientEditor.prototype.updateView = function () {
        var _this = this;
        if (!this.stage)
            return;
        var list = [];
        for (var key in feng3d.GradientMode) {
            if (isNaN(Number(key)))
                list.push({ label: key, value: feng3d.GradientMode[key] });
        }
        this.modeCB.dataProvider = list;
        this.modeCB.data = list.filter(function (v) { return v.value == _this.gradient.mode; })[0];
        //
        if (this.colorImage.width > 0 && this.colorImage.height > 0) {
            this.colorImage.source = new feng3d.ImageUtil(this.colorImage.width, this.colorImage.height).drawMinMaxGradient(this.gradient).toDataURL();
        }
        if (!this._alphaSprite) {
            this.alphaLineGroup.addChild(this._alphaSprite = new egret.Sprite());
        }
        this._alphaSprite.graphics.clear();
        if (!this._colorSprite) {
            this.colorLineGroup.addChild(this._colorSprite = new egret.Sprite());
        }
        this._colorSprite.graphics.clear();
        //
        var alphaKeys = this.gradient.alphaKeys;
        for (var i = 0, n = alphaKeys.length; i < n; i++) {
            var element = alphaKeys[i];
            this._drawAlphaGraphics(this._alphaSprite.graphics, element.time, element.alpha, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == alphaKeys[i]);
        }
        var colorKeys = this.gradient.colorKeys;
        for (var i = 0, n = colorKeys.length; i < n; i++) {
            var element = colorKeys[i];
            this._drawColorGraphics(this._colorSprite.graphics, element.time, element.color, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == colorKeys[i]);
        }
        //
        this._parentGroup = this._parentGroup || this.colorGroup.parent;
        //
        if (this._alphaNumberSliderTextInputBinder) {
            this._alphaNumberSliderTextInputBinder.off("valueChanged", this._onLocationChanged, this);
            this._alphaNumberSliderTextInputBinder.dispose();
        }
        //
        if (this._loactionNumberTextInputBinder) {
            this._loactionNumberTextInputBinder.off("valueChanged", this._onLocationChanged, this);
            this._loactionNumberTextInputBinder.dispose();
        }
        this.controllerGroup.visible = !!this._selectedValue;
        if (this._selectedValue) {
            if (this._selectedValue.color) {
                this.alphaGroup.parent && this.alphaGroup.parent.removeChild(this.alphaGroup);
                this.colorGroup.parent || this._parentGroup.addChildAt(this.colorGroup, 0);
                //
                this.colorPicker.value = this._selectedValue.color;
            }
            else {
                this.colorGroup.parent && this.colorGroup.parent.removeChild(this.colorGroup);
                this.alphaGroup.parent || this._parentGroup.addChildAt(this.alphaGroup, 0);
                this._alphaNumberSliderTextInputBinder = new NumberSliderTextInputBinder_1.NumberSliderTextInputBinder().init({
                    space: this._selectedValue, attribute: "alpha",
                    slider: this.alphaSlide,
                    textInput: this.alphaInput, controller: this.alphaLabel, minValue: 0, maxValue: 1,
                });
                this._alphaNumberSliderTextInputBinder.on("valueChanged", this._onAlphaChanged, this);
            }
            this._loactionNumberTextInputBinder = new NumberTextInputBinder_1.NumberTextInputBinder().init({
                space: this._selectedValue, attribute: "time",
                textInput: this.locationInput, controller: this.locationLabel, minValue: 0, maxValue: 1,
            });
            this._loactionNumberTextInputBinder.on("valueChanged", this._onLocationChanged, this);
        }
    };
    GradientEditor.prototype._drawAlphaGraphics = function (graphics, time, alpha, width, height, selected) {
        graphics.beginFill(0xffffff, alpha);
        graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
        graphics.moveTo(time * width, height);
        graphics.lineTo(time * width - 5, height - 10);
        graphics.lineTo(time * width - 5, height - 15);
        graphics.lineTo(time * width + 5, height - 15);
        graphics.lineTo(time * width + 5, height - 10);
        graphics.lineTo(time * width, height);
        graphics.endFill();
    };
    GradientEditor.prototype._drawColorGraphics = function (graphics, time, color, width, height, selected) {
        graphics.beginFill(color.toInt(), 1);
        graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
        graphics.moveTo(time * width, 0);
        graphics.lineTo(time * width - 5, 10);
        graphics.lineTo(time * width - 5, 15);
        graphics.lineTo(time * width + 5, 15);
        graphics.lineTo(time * width + 5, 10);
        graphics.lineTo(time * width, 0);
        graphics.endFill();
    };
    GradientEditor.prototype._onAlphaChanged = function () {
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    GradientEditor.prototype._onLocationChanged = function () {
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    GradientEditor.prototype._onReSize = function () {
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
    };
    GradientEditor.prototype._onModeCBChange = function () {
        this.gradient.mode = this.modeCB.data.value;
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    GradientEditor.prototype._onColorPickerChange = function () {
        if (this._selectedValue && this._selectedValue.color) {
            this._selectedValue.color = new feng3d.Color3(this.colorPicker.value.r, this.colorPicker.value.g, this.colorPicker.value.b);
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    };
    GradientEditor.prototype._onGradientChanged = function () {
        this._selectedValue = this.gradient.colorKeys[0];
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
    };
    GradientEditor.prototype._onMouseDown = function (e) {
        this._onMouseDownLineGroup = e.currentTarget;
        var sp = e.currentTarget.localToGlobal(0, 0);
        var localPosX = feng3d.windowEventProxy.clientX - sp.x;
        var time = localPosX / e.currentTarget.width;
        var newAlphaKey = { time: time, alpha: this.gradient.getAlpha(time) };
        var newColorKey = { time: time, color: this.gradient.getColor(time) };
        switch (e.currentTarget) {
            case this.alphaLineGroup:
                this._selectedValue = null;
                var onClickIndex = -1;
                var alphaKeys = this.gradient.alphaKeys;
                for (var i = 0, n = alphaKeys.length; i < n; i++) {
                    var element = alphaKeys[i];
                    if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                        onClickIndex = i;
                        break;
                    }
                }
                if (onClickIndex != -1) {
                    this._selectedValue = alphaKeys[onClickIndex];
                }
                else if (alphaKeys.length < 8) {
                    this._selectedValue = newAlphaKey;
                    alphaKeys.push(newAlphaKey);
                    alphaKeys.sort(function (a, b) { return a.time - b.time; });
                }
                break;
            case this.colorLineGroup:
                var onClickIndex = -1;
                var colorKeys = this.gradient.colorKeys;
                for (var i = 0, n = colorKeys.length; i < n; i++) {
                    var element = colorKeys[i];
                    if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                        onClickIndex = i;
                        break;
                    }
                }
                if (onClickIndex != -1) {
                    this._selectedValue = colorKeys[onClickIndex];
                }
                else if (colorKeys.length < 8) {
                    this._selectedValue = newColorKey;
                    colorKeys.push(newColorKey);
                    colorKeys.sort(function (a, b) { return a.time - b.time; });
                }
                break;
        }
        if (this._selectedValue) {
            //
            this.updateView();
            feng3d.windowEventProxy.on("mousemove", this._onAlphaColorMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this._onAlphaColorMouseUp, this);
            this._removedTemp = false;
        }
    };
    GradientEditor.prototype._onAlphaColorMouseMove = function () {
        if (!this._selectedValue)
            return;
        var sp = this._onMouseDownLineGroup.localToGlobal(0, 0);
        var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var rect = new feng3d.Rectangle(sp.x, sp.y, this._onMouseDownLineGroup.width, this._onMouseDownLineGroup.height);
        rect.inflate(8, 8);
        if (rect.containsPoint(mousePos)) {
            if (this._removedTemp) {
                if (this._selectedValue.color) {
                    var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                    if (index == -1)
                        this.gradient.colorKeys.push(this._selectedValue);
                    this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
                    ;
                }
                else {
                    var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                    if (index == -1)
                        this.gradient.alphaKeys.push(this._selectedValue);
                    this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
                    ;
                }
                this._removedTemp = false;
            }
        }
        else {
            if (!this._removedTemp) {
                if (this._selectedValue.color) {
                    var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                    if (index != -1)
                        this.gradient.colorKeys.splice(index, 1);
                    this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
                    ;
                }
                else {
                    var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                    if (index != -1)
                        this.gradient.alphaKeys.splice(index, 1);
                    this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
                    ;
                }
                this._removedTemp = true;
            }
        }
        if (this._selectedValue.color) {
            var sp = this.colorLineGroup.localToGlobal(0, 0);
            var localPosX = feng3d.windowEventProxy.clientX - sp.x;
            this._selectedValue.time = localPosX / this.colorLineGroup.width;
            this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
            ;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        else {
            var sp = this.alphaLineGroup.localToGlobal(0, 0);
            var localPosX = feng3d.windowEventProxy.clientX - sp.x;
            this._selectedValue.time = localPosX / this.alphaLineGroup.width;
            this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    GradientEditor.prototype._onAlphaColorMouseUp = function () {
        if (this._removedTemp) {
            this._selectedValue = null;
        }
        this._onMouseDownLineGroup = null;
        feng3d.windowEventProxy.off("mousemove", this._onAlphaColorMouseMove, this);
        feng3d.windowEventProxy.off("mouseup", this._onAlphaColorMouseUp, this);
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
    };
    __decorate([
        feng3d.watch("_onGradientChanged")
    ], GradientEditor.prototype, "gradient", void 0);
    return GradientEditor;
}(eui.Component));
exports.GradientEditor = GradientEditor;
//# sourceMappingURL=GradientEditor.js.map