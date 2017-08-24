var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var BooleanAttrView = (function (_super) {
            __extends(BooleanAttrView, _super);
            function BooleanAttrView(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "BooleanAttrViewSkin";
                return _this;
            }
            BooleanAttrView.prototype.onComplete = function () {
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.label.text = this._attributeName;
                this.updateView();
            };
            Object.defineProperty(BooleanAttrView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            BooleanAttrView.prototype.updateView = function () {
                this.checkBox["selected"] = this.attributeValue;
            };
            BooleanAttrView.prototype.onChange = function (event) {
                this.attributeValue = this.checkBox["selected"];
            };
            Object.defineProperty(BooleanAttrView.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BooleanAttrView.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                        var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                        objectViewEvent.space = this._space;
                        objectViewEvent.attributeName = this._attributeName;
                        objectViewEvent.attributeValue = this.attributeValue;
                        this.dispatchEvent(objectViewEvent);
                    }
                },
                enumerable: true,
                configurable: true
            });
            BooleanAttrView = __decorate([
                OVAComponent()
            ], BooleanAttrView);
            return BooleanAttrView;
        }(eui.Component));
        editor.BooleanAttrView = BooleanAttrView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=BooleanAttrView.js.map