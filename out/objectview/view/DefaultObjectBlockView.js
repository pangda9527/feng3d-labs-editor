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
         * 默认对象属性块界面
         * @author feng 2016-3-22
         */
        var DefaultObjectBlockView = (function (_super) {
            __extends(DefaultObjectBlockView, _super);
            /**
             * @inheritDoc
             */
            function DefaultObjectBlockView(blockViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = blockViewInfo.owner;
                _this._blockName = blockViewInfo.name;
                _this.itemList = blockViewInfo.itemList;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectBlockView";
                return _this;
            }
            DefaultObjectBlockView.prototype.onComplete = function () {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.$updateView();
            };
            DefaultObjectBlockView.prototype.initView = function () {
                var h = 0;
                if (this._blockName != null && this._blockName.length > 0) {
                    this.addChildAt(this.border, 0);
                    this.group.addChildAt(this.titleGroup, 0);
                }
                else {
                    this.removeChild(this.border);
                    this.group.removeChild(this.titleGroup);
                }
                this.attributeViews = [];
                var objectAttributeInfos = this.itemList;
                for (var i = 0; i < objectAttributeInfos.length; i++) {
                    var displayObject = objectview.getAttributeView(objectAttributeInfos[i]);
                    displayObject.percentWidth = 100;
                    this.contentGroup.addChild(displayObject);
                    this.attributeViews.push(displayObject);
                }
                this.isInitView = true;
            };
            Object.defineProperty(DefaultObjectBlockView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.attributeViews.length; i++) {
                        this.attributeViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultObjectBlockView.prototype, "blockName", {
                get: function () {
                    return this._blockName;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新自身界面
             */
            DefaultObjectBlockView.prototype.$updateView = function () {
                if (!this.isInitView) {
                    this.initView();
                }
            };
            DefaultObjectBlockView.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].updateView();
                }
            };
            DefaultObjectBlockView.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.attributeViews.length; i++) {
                    if (this.attributeViews[i].attributeName == attributeName) {
                        return this.attributeViews[i];
                    }
                }
                return null;
            };
            DefaultObjectBlockView.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            DefaultObjectBlockView = __decorate([
                OVBComponent()
            ], DefaultObjectBlockView);
            return DefaultObjectBlockView;
        }(eui.Component));
        editor.DefaultObjectBlockView = DefaultObjectBlockView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DefaultObjectBlockView.js.map