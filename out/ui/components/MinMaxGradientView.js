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
     * 最大最小颜色渐变界面
     */
    var MinMaxGradientView = /** @class */ (function (_super) {
        __extends(MinMaxGradientView, _super);
        function MinMaxGradientView() {
            var _this = _super.call(this) || this;
            //
            _this.minMaxGradient = new feng3d.MinMaxGradient();
            _this.skinName = "MinMaxGradientView";
            return _this;
        }
        MinMaxGradientView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.secondGroupParent = this.secondGroupParent || this.secondGroup.parent;
            this.colorGroup0.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        };
        MinMaxGradientView.prototype.$onRemoveFromStage = function () {
            this.colorGroup0.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxGradientView.prototype.updateView = function () {
            //
            if (this.colorGroup0.width > 0 && this.colorGroup0.height > 0) {
                if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color) {
                    var color = this.minMaxGradient.getValue(0);
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(color).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Gradient) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(this.minMaxGradient.color).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawColorRect(this.minMaxGradient.color1).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoGradients) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawMinMaxGradient(this.minMaxGradient.gradient1).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomColor) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
            }
        };
        MinMaxGradientView.prototype.onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxGradientView.prototype._onMinMaxGradientChanged = function () {
            if (this.stage)
                this.updateView();
        };
        MinMaxGradientView.prototype.onClick = function (e) {
            var _this = this;
            var view = null;
            switch (e.currentTarget) {
                case this.colorGroup0:
                    this.activeColorGroup = this.colorGroup0;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.Color:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.Gradient:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.RandomColor:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                    }
                    break;
                case this.colorGroup1:
                    this.activeColorGroup = this.colorGroup1;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color1;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient1;
                            break;
                    }
                    break;
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, function (v) {
                        _this.minMaxGradient.mode = v;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    });
                    break;
            }
            if (view) {
                var pos = this.localToGlobal(0, 0);
                pos.x = pos.x - 318;
                view.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                //
                popupview.popupView(view, function () {
                    view.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
                    _this.activeColorGroup = null;
                }, pos.x, pos.y);
            }
        };
        MinMaxGradientView.prototype.onPickerViewChanged = function () {
            if (this.activeColorGroup == this.colorGroup0) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.Color:
                        this.minMaxGradient.color = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.Gradient:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                        this.minMaxGradient.color = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomColor:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                }
            }
            else if (this.activeColorGroup == this.colorGroup1) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                        this.minMaxGradient.color1 = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                        this.minMaxGradient.gradient1 = gradientEditor.gradient;
                        break;
                }
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxGradientView.prototype._onRightClick = function (e) {
            var _this = this;
            var mode = this.minMaxGradient.mode;
            var target = e.currentTarget;
            var menus = [{
                    label: "Copy", click: function () {
                        if (target == _this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                copyColor = _this.minMaxGradient.color.clone();
                            else
                                copyGradient = Object.deepClone(_this.minMaxGradient.gradient);
                        }
                        else if (target == _this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                copyColor = _this.minMaxGradient.color1.clone();
                            else
                                copyGradient = Object.deepClone(_this.minMaxGradient.gradient1);
                        }
                    }
                }];
            if ((copyGradient != null && (mode == feng3d.MinMaxGradientMode.Gradient || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoGradients || mode == feng3d.MinMaxGradientMode.RandomColor))
                || (copyColor != null && (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors))) {
                menus.push({
                    label: "Paste", click: function () {
                        if (target == _this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                _this.minMaxGradient.color.copy(copyColor);
                            else
                                Object.setValue(_this.minMaxGradient.gradient, copyGradient);
                        }
                        else if (target == _this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                _this.minMaxGradient.color1.copy(copyColor);
                            else
                                Object.setValue(_this.minMaxGradient.gradient1, copyGradient);
                        }
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                        _this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            menu.popup(menus);
        };
        __decorate([
            feng3d.watch("_onMinMaxGradientChanged")
        ], MinMaxGradientView.prototype, "minMaxGradient", void 0);
        return MinMaxGradientView;
    }(eui.Component));
    editor.MinMaxGradientView = MinMaxGradientView;
    var copyGradient;
    var copyColor;
})(editor || (editor = {}));
//# sourceMappingURL=MinMaxGradientView.js.map