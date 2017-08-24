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
        /**
         * 默认对象属性界面
         * @author feng 2016-3-10
         */
        var DefaultObjectAttributeView = (function (_super) {
            __extends(DefaultObjectAttributeView, _super);
            function DefaultObjectAttributeView(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectAttributeView";
                return _this;
            }
            DefaultObjectAttributeView.prototype.onComplete = function () {
                this.text.percentWidth = 100;
                this.text.enabled = this.attributeViewInfo.writable;
                this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.updateView();
            };
            Object.defineProperty(DefaultObjectAttributeView.prototype, "space", {
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
            Object.defineProperty(DefaultObjectAttributeView.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultObjectAttributeView.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            DefaultObjectAttributeView.prototype.updateView = function () {
                this.label.text = this._attributeName;
                if (this.attributeValue === undefined) {
                    this.text.text = String(this.attributeValue);
                    this.text.enabled = false;
                }
                else if (!(this.attributeValue instanceof Object)) {
                    this.text.text = String(this.attributeValue);
                }
                else {
                    this.text.enabled = false;
                    this.text.text = "[" + feng3d.ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + "]";
                    this.once(editor.MouseEvent.CLICK, this.onClick, this);
                }
            };
            DefaultObjectAttributeView.prototype.onClick = function () {
                editor.editor3DData.inspectorViewData.showData(this.attributeValue);
            };
            DefaultObjectAttributeView.prototype.onTextChange = function () {
                switch (this._attributeType) {
                    case "String":
                        this.attributeValue = this.text.text;
                        break;
                    case "Number":
                        this.attributeValue = Number(this.text.text);
                        break;
                    case "Boolean":
                        this.attributeValue = Boolean(this.text.text);
                        break;
                    default:
                        throw "\u65E0\u6CD5\u5904\u7406\u7C7B\u578B" + this._attributeType + "!";
                }
            };
            DefaultObjectAttributeView = __decorate([
                OVAComponent()
            ], DefaultObjectAttributeView);
            return DefaultObjectAttributeView;
        }(eui.Component));
        editor.DefaultObjectAttributeView = DefaultObjectAttributeView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DefaultObjectAttributeView.js.map