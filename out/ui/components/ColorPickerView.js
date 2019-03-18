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
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
    /**
     */
    var ColorPickerView = /** @class */ (function (_super) {
        __extends(ColorPickerView, _super);
        function ColorPickerView() {
            var _this = _super.call(this) || this;
            //
            _this.color = new feng3d.Color4(0.2, 0.5, 0);
            _this.skinName = "ColorPickerView";
            return _this;
        }
        ColorPickerView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var w = this.group1.width - 4;
            var h = this.group1.height - 4;
            this.image1.source = new feng3d.ImageUtil(w, h).drawMinMaxGradient(new feng3d.Gradient().fromColors(colors), false).toDataURL();
            this.updateView();
            //
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        };
        ColorPickerView.prototype.$onRemoveFromStage = function () {
            //
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            //
            _super.prototype.$onRemoveFromStage.call(this);
        };
        ColorPickerView.prototype.onMouseDown = function (e) {
            this._mouseDownGroup = e.currentTarget;
            this.onMouseMove();
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        };
        ColorPickerView.prototype.onMouseMove = function () {
            var image = this.image0;
            if (this._mouseDownGroup == this.group0)
                image = this.image0;
            else
                image = this.image1;
            var p = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var start = image.localToGlobal(0, 0);
            var end = image.localToGlobal(image.width, image.height);
            var rw = feng3d.FMath.clamp((p.x - start.x) / (end.x - start.x), 0, 1);
            var rh = feng3d.FMath.clamp((p.y - start.y) / (end.y - start.y), 0, 1);
            if (this.group0 == this._mouseDownGroup) {
                this.rw = rw;
                this.rh = rh;
                var color = getColorPickerRectAtPosition(this.basecolor.toInt(), rw, rh);
            }
            else if (this.group1 == this._mouseDownGroup) {
                this.ratio = rh;
                var basecolor = this.basecolor = getMixColorAtRatio(rh, colors);
                var color = getColorPickerRectAtPosition(basecolor.toInt(), this.rw, this.rh);
            }
            if (this.color instanceof feng3d.Color3) {
                this.color = color;
            }
            else {
                this.color = new feng3d.Color4(color.r, color.g, color.b, this.color.a);
            }
        };
        ColorPickerView.prototype.onMouseUp = function () {
            this._mouseDownGroup = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        ColorPickerView.prototype.ontxtfocusin = function (e) {
            this._textfocusintxt = e.currentTarget;
        };
        ColorPickerView.prototype.ontxtfocusout = function (e) {
            this._textfocusintxt = null;
            this.updateView();
        };
        ColorPickerView.prototype.onTextChange = function (e) {
            if (this._textfocusintxt == e.currentTarget) {
                var color = this.color.clone();
                switch (this._textfocusintxt) {
                    case this.txtR:
                        color.r = (Number(this.txtR.text) || 0) / 255;
                        break;
                    case this.txtG:
                        color.g = (Number(this.txtG.text) || 0) / 255;
                        break;
                    case this.txtB:
                        color.b = (Number(this.txtB.text) || 0) / 255;
                        break;
                    case this.txtA:
                        color.a = (Number(this.txtA.text) || 0) / 255;
                        break;
                    case this.txtColor:
                        color.fromUnit(Number("0x" + this.txtColor.text) || 0);
                        break;
                }
                this.color = color;
            }
        };
        ColorPickerView.prototype.onColorChanged = function (property, oldValue, newValue) {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            if (oldValue && newValue && !oldValue.equals(newValue)) {
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        ColorPickerView.prototype.updateView = function () {
            if (this._textfocusintxt != this.txtR)
                this.txtR.text = Math.round(this.color.r * 255).toString();
            if (this._textfocusintxt != this.txtG)
                this.txtG.text = Math.round(this.color.g * 255).toString();
            if (this._textfocusintxt != this.txtB)
                this.txtB.text = Math.round(this.color.b * 255).toString();
            if (this._textfocusintxt != this.txtA)
                this.txtA.text = Math.round(this.color.a * 255).toString();
            if (this._textfocusintxt != this.txtColor)
                this.txtColor.text = this.color.toHexString().substr(1);
            if (this._mouseDownGroup == null) {
                //
                var result = getColorPickerRectPosition(this.color.toInt());
                this.basecolor = result.color;
                this.rw = result.ratioW;
                this.rh = result.ratioH;
                this.ratio = getMixColorRatio(this.basecolor.toInt(), colors);
            }
            if (this._mouseDownGroup != this.group0) {
                //
                this.image0.source = new feng3d.ImageUtil(this.group0.width - 16, this.group0.height - 16).drawColorPickerRect(this.basecolor.toInt()).toDataURL();
            }
            this.pos1.y = this.ratio * (this.group1.height - this.pos1.height);
            //
            this.pos0.x = this.rw * (this.group0.width - this.pos0.width);
            this.pos0.y = this.rh * (this.group0.height - this.pos0.height);
            //
            if (this.color instanceof feng3d.Color3) {
                this._groupAParent = this._groupAParent || this.groupA.parent;
                this.groupA.parent && this.groupA.parent.removeChild(this.groupA);
            }
            else {
                if (this.groupA.parent == null && this._groupAParent) {
                    this._groupAParent.addChildAt(this.groupA, 3);
                }
            }
        };
        __decorate([
            feng3d.watch("onColorChanged")
        ], ColorPickerView.prototype, "color", void 0);
        return ColorPickerView;
    }(eui.Component));
    editor.ColorPickerView = ColorPickerView;
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectPosition(color) {
        var black = new feng3d.Color3(0, 0, 0);
        var white = new feng3d.Color3(1, 1, 1);
        var c = new feng3d.Color3().fromUnit(color);
        var max = Math.max(c.r, c.g, c.b);
        if (max != 0)
            c = black.mix(c, 1 / max);
        var min = Math.min(c.r, c.g, c.b);
        if (min != 1)
            c = white.mix(c, 1 / (1 - min));
        var ratioH = 1 - max;
        var ratioW = 1 - min;
        return {
            /**
             * 基色
             */
            color: c,
            /**
             * 横向位置
             */
            ratioW: ratioW,
            /**
             * 纵向位置
             */
            ratioH: ratioH
        };
    }
    function getMixColorRatio(color, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (var i_1 = 0; i_1 < colors.length; i_1++) {
                ratios[i_1] = i_1 / (colors.length - 1);
            }
        }
        var colors1 = colors.map(function (v) { return new feng3d.Color3().fromUnit(v); });
        var c = new feng3d.Color3().fromUnit(color);
        var r = c.r;
        var g = c.g;
        var b = c.b;
        for (var i = 0; i < colors1.length - 1; i++) {
            var c0 = colors1[i];
            var c1 = colors1[i + 1];
            //
            if (c.equals(c0))
                return ratios[i];
            if (c.equals(c1))
                return ratios[i + 1];
            //
            var r1 = c0.r + c1.r;
            var g1 = c0.g + c1.g;
            var b1 = c0.b + c1.b;
            //
            var v = r * r1 + g * g1 + b * b1;
            if (v > 2) {
                var result = 0;
                if (r1 == 1) {
                    result = feng3d.FMath.mapLinear(r, c0.r, c1.r, ratios[i], ratios[i + 1]);
                }
                else if (g1 == 1) {
                    result = feng3d.FMath.mapLinear(g, c0.g, c1.g, ratios[i], ratios[i + 1]);
                }
                else if (b1 == 1) {
                    result = feng3d.FMath.mapLinear(b, c0.b, c1.b, ratios[i], ratios[i + 1]);
                }
                return result;
            }
        }
        return 0;
    }
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectAtPosition(color, rw, rh) {
        var leftTop = new feng3d.Color3(1, 1, 1);
        var rightTop = new feng3d.Color3().fromUnit(color);
        var leftBottom = new feng3d.Color3(0, 0, 0);
        var rightBottom = new feng3d.Color3(0, 0, 0);
        var top = leftTop.mixTo(rightTop, rw);
        var bottom = leftBottom.mixTo(rightBottom, rw);
        var v = top.mixTo(bottom, rh);
        return v;
    }
    function getMixColorAtRatio(ratio, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (var i_2 = 0; i_2 < colors.length; i_2++) {
                ratios[i_2] = i_2 / (colors.length - 1);
            }
        }
        var colors1 = colors.map(function (v) { return new feng3d.Color3().fromUnit(v); });
        for (var i = 0; i < colors1.length - 1; i++) {
            if (ratios[i] <= ratio && ratio <= ratios[i + 1]) {
                var mix = feng3d.FMath.mapLinear(ratio, ratios[i], ratios[i + 1], 0, 1);
                var c = colors1[i].mixTo(colors1[i + 1], mix);
                return c;
            }
        }
        return colors1[0];
    }
})(editor || (editor = {}));
//# sourceMappingURL=ColorPickerView.js.map