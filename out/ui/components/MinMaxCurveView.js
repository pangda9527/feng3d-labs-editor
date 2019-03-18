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
    /**
     * 最大最小曲线界面
     */
    var MinMaxCurveView = /** @class */ (function (_super) {
        __extends(MinMaxCurveView, _super);
        function MinMaxCurveView() {
            var _this = _super.call(this) || this;
            _this.minMaxCurve = new feng3d.MinMaxCurve();
            _this.skinName = "MinMaxCurveView";
            return _this;
        }
        MinMaxCurveView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        };
        MinMaxCurveView.prototype.$onRemoveFromStage = function () {
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveView.prototype.updateView = function () {
            this.constantGroup.visible = false;
            this.curveGroup.visible = false;
            this.randomBetweenTwoConstantsGroup.visible = false;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant) {
                this.constantGroup.visible = true;
                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.constantTextInput, editable: true,
                    controller: null,
                }));
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants) {
                this.randomBetweenTwoConstantsGroup.visible = true;
                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.minValueTextInput, editable: true,
                    controller: null,
                }));
                this.addBinder(new NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant1", textInput: this.maxValueTextInput, editable: true,
                    controller: null,
                }));
            }
            else {
                this.curveGroup.visible = true;
                var imageUtil = new feng3d.ImageUtil(this.curveGroup.width - 2, this.curveGroup.height - 2, feng3d.Color4.fromUnit(0xff565656));
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                    imageUtil.drawCurve(this.minMaxCurve.curve, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                    imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curve1, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                this.curveImage.source = imageUtil.toDataURL();
            }
        };
        MinMaxCurveView.prototype.onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveView.prototype._onMinMaxCurveChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveView.prototype.onClick = function (e) {
            var _this = this;
            switch (e.currentTarget) {
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxCurveMode, this.minMaxCurve.mode, function (v) {
                        _this.minMaxCurve.mode = v;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    });
                    break;
                case this.curveGroup:
                    editor.minMaxCurveEditor = editor.minMaxCurveEditor || new editor.MinMaxCurveEditor();
                    editor.minMaxCurveEditor.minMaxCurve = this.minMaxCurve;
                    var pos = this.localToGlobal(0, 0);
                    pos.x = pos.x - 318;
                    editor.minMaxCurveEditor.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    popupview.popupView(editor.minMaxCurveEditor, function () {
                        editor.minMaxCurveEditor.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
                    }, pos.x, pos.y);
                    break;
            }
        };
        MinMaxCurveView.prototype.onPickerViewChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxCurveView.prototype._onRightClick = function () {
            var _this = this;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant || this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants)
                return;
            var menus = [{
                    label: "Copy", click: function () {
                        copyCurve = Object.deepClone(_this.minMaxCurve);
                    }
                }];
            if (copyCurve && this.minMaxCurve.mode == copyCurve.mode && copyCurve.between0And1 == this.minMaxCurve.between0And1) {
                menus.push({
                    label: "Paste", click: function () {
                        Object.setValue(_this.minMaxCurve, copyCurve);
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                        _this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            menu.popup(menus);
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveChanged")
        ], MinMaxCurveView.prototype, "minMaxCurve", void 0);
        return MinMaxCurveView;
    }(eui.Component));
    editor.MinMaxCurveView = MinMaxCurveView;
    var copyCurve;
})(editor || (editor = {}));
//# sourceMappingURL=MinMaxCurveView.js.map