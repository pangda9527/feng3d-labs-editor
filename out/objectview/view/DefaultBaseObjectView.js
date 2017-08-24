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
         * 默认基础对象界面
         * @author feng 2016-3-11
         */
        var DefaultBaseObjectView = (function (_super) {
            __extends(DefaultBaseObjectView, _super);
            function DefaultBaseObjectView(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultBaseObjectView";
                return _this;
            }
            DefaultBaseObjectView.prototype.onComplete = function () {
                this.updateView();
            };
            Object.defineProperty(DefaultBaseObjectView.prototype, "space", {
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
            DefaultBaseObjectView.prototype.getAttributeView = function (attributeName) {
                return null;
            };
            DefaultBaseObjectView.prototype.getblockView = function (blockName) {
                return null;
            };
            /**
             * 更新界面
             */
            DefaultBaseObjectView.prototype.updateView = function () {
                this.label.text = String(this._space);
            };
            DefaultBaseObjectView = __decorate([
                OVComponent()
            ], DefaultBaseObjectView);
            return DefaultBaseObjectView;
        }(eui.Component));
        editor.DefaultBaseObjectView = DefaultBaseObjectView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DefaultBaseObjectView.js.map