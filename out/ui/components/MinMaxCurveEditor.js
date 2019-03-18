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
define(["require", "exports", "./binders/NumberTextInputBinder"], function (require, exports, NumberTextInputBinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MinMaxCurveEditor = /** @class */ (function (_super) {
        __extends(MinMaxCurveEditor, _super);
        function MinMaxCurveEditor() {
            var _this = _super.call(this) || this;
            _this.minMaxCurve = new feng3d.MinMaxCurve();
            _this.editing = false;
            _this.mousedownxy = { x: -1, y: -1 };
            _this.curveColor = new feng3d.Color4(1, 0, 0);
            _this.backColor = feng3d.Color4.fromUnit24(0x565656);
            _this.fillTwoCurvesColor = new feng3d.Color4(1, 1, 1, 0.2);
            _this.range = [1, -1];
            _this.imageUtil = new feng3d.ImageUtil();
            /**
             * 点绘制尺寸
             */
            _this.pointSize = 5;
            /**
             * 控制柄长度
             */
            _this.controllerLength = 50;
            _this.skinName = "MinMaxCurveEditor";
            return _this;
        }
        MinMaxCurveEditor.prototype.$onAddToStage = function (stage, nestLevel) {
            var _this = this;
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.yLabels = [this.y_0, this.y_1, this.y_2, this.y_3];
            this.xLabels = [this.x_0, this.x_1, this.x_2, this.x_3, this.x_4, this.x_5, this.x_6, this.x_7, this.x_8, this.x_9, this.x_10];
            this.sampleImages = [this.sample_0, this.sample_1, this.sample_2, this.sample_3, this.sample_4, this.sample_5, this.sample_6, this.sample_7];
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("dblclick", this.ondblclick, this);
            this.sampleImages.forEach(function (v) { return v.addEventListener(egret.MouseEvent.CLICK, _this.onSampleClick, _this); });
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
            this.addBinder(new NumberTextInputBinder_1.NumberTextInputBinder().init({
                space: this.minMaxCurve, attribute: "curveMultiplier", textInput: this.multiplierInput, editable: true,
                controller: null,
            }));
            feng3d.watcher.watch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            this.updateXYLabels();
            this.updateSampleImages();
            this.updateView();
        };
        MinMaxCurveEditor.prototype.$onRemoveFromStage = function () {
            var _this = this;
            this.sampleImages.forEach(function (v) { return v.removeEventListener(egret.MouseEvent.CLICK, _this.onSampleClick, _this); });
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("dblclick", this.ondblclick, this);
            feng3d.watcher.unwatch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveEditor.prototype.updateView = function () {
            if (!this.stage)
                return;
            // 曲线绘制区域
            this.curveRect = new feng3d.Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
            this.canvasRect = new feng3d.Rectangle(0, 0, this.viewGroup.width, this.viewGroup.height);
            if (this.curveGroup.width < 10 || this.curveGroup.height < 10)
                return;
            this.imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
            this.drawGrid();
            this.timeline = this.minMaxCurve.curve;
            this.timeline1 = this.minMaxCurve.curve1;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                this.imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                this.imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curve1, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
                this.drawCurveKeys(this.timeline1);
            }
            this.drawSelectedKey();
            // 设置绘制结果
            this.curveImage.source = this.imageUtil.toDataURL();
        };
        MinMaxCurveEditor.prototype.updateXYLabels = function () {
            this.yLabels[0].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[1].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.25, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[2].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.5, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[3].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.75, 1, 0, this.range[0], this.range[1])).toString();
            // for (let i = 0; i <= 10; i++)
            // {
            //     this.xLabels[i].text = (this.minMaxCurve.curveMultiplier * i / 10).toString();
            // }
        };
        MinMaxCurveEditor.prototype.updateSampleImages = function () {
            var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
            var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
            for (var i = 0; i < this.sampleImages.length; i++) {
                var element = this.sampleImages[i];
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve && curves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawCurve(curves[i], this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves && doubleCurves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawBetweenTwoCurves(doubleCurves[i].curveMin, doubleCurves[i].curveMax, this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else {
                    element.parent && element.parent.removeChild(element);
                }
            }
        };
        MinMaxCurveEditor.prototype.onSampleClick = function (e) {
            for (var i = 0; i < this.sampleImages.length; i++) {
                var element = this.sampleImages[i];
                if (element == e.currentTarget) {
                    var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
                    var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
                    if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                        var curve = this.minMaxCurve.curve;
                        Object.setValue(curve, curves[i]);
                    }
                    else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                        Object.setValue(this.minMaxCurve.curve, doubleCurves[i].curveMin);
                        Object.setValue(this.minMaxCurve.curve1, doubleCurves[i].curveMax);
                    }
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    break;
                }
            }
        };
        /**
         * 绘制曲线关键点
         * @param animationCurve
         */
        MinMaxCurveEditor.prototype.drawCurveKeys = function (animationCurve) {
            var _this = this;
            var c = new feng3d.Color4(1, 0, 0);
            animationCurve.keys.forEach(function (key) {
                var pos = _this.curveToUIPos(key.time, key.value);
                _this.imageUtil.drawPoint(pos.x, pos.y, c, _this.pointSize);
            });
        };
        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time
         * @param value
         */
        MinMaxCurveEditor.prototype.curveToUIPos = function (time, value) {
            var x = feng3d.FMath.mapLinear(time, 0, 1, this.curveRect.left, this.curveRect.right);
            var y = feng3d.FMath.mapLinear(value, this.range[0], this.range[1], this.curveRect.top, this.curveRect.bottom);
            return new feng3d.Vector2(x, y);
        };
        /**
         * UI上坐标转换为曲线上坐标
         * @param x
         * @param y
         */
        MinMaxCurveEditor.prototype.uiToCurvePos = function (x, y) {
            var time = feng3d.FMath.mapLinear(x, this.curveRect.left, this.curveRect.right, 0, 1);
            var value = feng3d.FMath.mapLinear(y, this.curveRect.top, this.curveRect.bottom, this.range[0], this.range[1]);
            return { time: time, value: value };
        };
        MinMaxCurveEditor.prototype.getKeyUIPos = function (key) {
            return this.curveToUIPos(key.time, key.value);
        };
        MinMaxCurveEditor.prototype.getKeyLeftControlUIPos = function (key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var lcp = new feng3d.Vector2(current.x - this.controllerLength * Math.cos(Math.atan(currenttan)), current.y + this.controllerLength * Math.sin(Math.atan(currenttan)));
            return lcp;
        };
        MinMaxCurveEditor.prototype.getKeyRightControlUIPos = function (key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var rcp = new feng3d.Vector2(current.x + this.controllerLength * Math.cos(Math.atan(currenttan)), current.y - this.controllerLength * Math.sin(Math.atan(currenttan)));
            return rcp;
        };
        /**
         * 绘制选中的关键点
         */
        MinMaxCurveEditor.prototype.drawSelectedKey = function () {
            if (this.selectedKey == null || this.selectTimeline == null)
                return;
            var key = this.selectedKey;
            //
            var i = this.selectTimeline.keys.indexOf(key);
            if (i == -1)
                return;
            var n = this.selectTimeline.keys.length;
            var c = new feng3d.Color4();
            var current = this.getKeyUIPos(key);
            this.imageUtil.drawPoint(current.x, current.y, c, this.pointSize);
            if (this.selectedKey == key) {
                // 绘制控制点
                if (i > 0) {
                    var lcp = this.getKeyLeftControlUIPos(key);
                    this.imageUtil.drawPoint(lcp.x, lcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, lcp, new feng3d.Color4());
                }
                if (i < n - 1) {
                    var rcp = this.getKeyRightControlUIPos(key);
                    this.imageUtil.drawPoint(rcp.x, rcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, rcp, new feng3d.Color4());
                }
            }
        };
        MinMaxCurveEditor.prototype.drawGrid = function (segmentW, segmentH) {
            var _this = this;
            if (segmentW === void 0) { segmentW = 10; }
            if (segmentH === void 0) { segmentH = 2; }
            //
            var lines = [];
            var c0 = feng3d.Color4.fromUnit24(0x494949);
            var c1 = feng3d.Color4.fromUnit24(0x4f4f4f);
            for (var i = 0; i <= segmentW; i++) {
                lines.push({ start: new feng3d.Vector2(i / segmentW, 0), end: new feng3d.Vector2(i / segmentW, 1), color: i % 2 == 0 ? c0 : c1 });
            }
            for (var i = 0; i <= segmentH; i++) {
                lines.push({ start: new feng3d.Vector2(0, i / segmentH), end: new feng3d.Vector2(1, i / segmentH), color: i % 2 == 0 ? c0 : c1 });
            }
            lines.forEach(function (v) {
                v.start.x = _this.curveRect.x + _this.curveRect.width * v.start.x;
                v.start.y = _this.curveRect.y + _this.curveRect.height * v.start.y;
                v.end.x = _this.curveRect.x + _this.curveRect.width * v.end.x;
                v.end.y = _this.curveRect.y + _this.curveRect.height * v.end.y;
                //
                _this.imageUtil.drawLine(v.start, v.end, v.color);
            });
        };
        MinMaxCurveEditor.prototype._onMinMaxCurveChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.range = this.minMaxCurve.between0And1 ? [1, 0] : [1, -1];
        };
        MinMaxCurveEditor.prototype._onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveEditor.prototype.onMouseDown = function (ev) {
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            this.mousedownxy.x = x;
            this.mousedownxy.y = y;
            var curvePos = this.uiToCurvePos(x, y);
            var timeline = this.timeline;
            this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (this.editKey == null && this.timeline1 != null) {
                timeline = this.timeline1;
                this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            }
            if (this.editKey != null) {
                this.selectedKey = this.editKey;
                this.selectTimeline = timeline;
            }
            else if (this.selectedKey) {
                this.editorControlkey = this.findControlKey(this.selectedKey, x, y, this.pointSize);
                if (this.editorControlkey == null) {
                    this.selectedKey = null;
                    this.selectTimeline = null;
                }
            }
            if (this.editKey != null || this.editorControlkey != null) {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxCurveEditor.prototype.onMouseMove = function (ev) {
            this.editing = true;
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            if (this.editKey) {
                curvePos.time = feng3d.FMath.clamp(curvePos.time, 0, 1);
                curvePos.value = feng3d.FMath.clamp(curvePos.value, this.range[0], this.range[1]);
                //
                this.editKey.time = curvePos.time;
                this.editKey.value = curvePos.value;
                this.selectTimeline.sort();
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
            else if (this.editorControlkey) {
                var index = this.selectTimeline.indexOfKeys(this.editorControlkey);
                if (index == 0 && curvePos.time < this.editorControlkey.time) {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.selectTimeline.numKeys - 1 && curvePos.time > this.editorControlkey.time) {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.editorControlkey.tangent = (curvePos.value - this.editorControlkey.value) / (curvePos.time - this.editorControlkey.time);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        MinMaxCurveEditor.prototype.onMouseUp = function (ev) {
            this.editing = false;
            this.editorControlkey = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        MinMaxCurveEditor.prototype.findControlKey = function (key, x, y, radius) {
            var lcp = this.getKeyLeftControlUIPos(key);
            if (Math.abs(lcp.x - x) < radius && Math.abs(lcp.y - y) < radius) {
                return key;
            }
            var rcp = this.getKeyRightControlUIPos(key);
            if (Math.abs(rcp.x - x) < radius && Math.abs(rcp.y - y) < radius) {
                return key;
            }
            return null;
        };
        MinMaxCurveEditor.prototype.ondblclick = function (ev) {
            this.editing = false;
            this.editKey = null;
            this.editorControlkey = null;
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            var selectedKey = this.timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (selectedKey != null) {
                this.timeline.deleteKey(selectedKey);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var selectedKey = this.timeline1.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (selectedKey != null) {
                    this.timeline1.deleteKey(selectedKey);
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
            // 没有选中关键与控制点时，检查是否点击到曲线
            var newKey = this.timeline.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (newKey) {
                this.selectedKey = newKey;
                this.selectTimeline = this.timeline;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var newKey = this.timeline1.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (newKey) {
                    this.selectedKey = newKey;
                    this.selectTimeline = this.timeline1;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveChanged")
        ], MinMaxCurveEditor.prototype, "minMaxCurve", void 0);
        return MinMaxCurveEditor;
    }(eui.Component));
    exports.MinMaxCurveEditor = MinMaxCurveEditor;
    var particleCurves = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];
    var particleCurvesSingend = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];
    var particleDoubleCurves = [{
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
    ];
    var particleDoubleCurvesSingend = [
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: -1, tangent: 0 }, { time: 1, value: -1, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
    ];
    exports.minMaxCurveEditor = new MinMaxCurveEditor();
});
//# sourceMappingURL=MinMaxCurveEditor.js.map