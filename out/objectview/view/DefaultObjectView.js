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
         * 默认使用块的对象界面
         * @author feng 2016-3-22
         */
        var DefaultObjectView = (function (_super) {
            __extends(DefaultObjectView, _super);
            /**
             * 对象界面数据
             */
            function DefaultObjectView(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._objectViewInfo = objectViewInfo;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "DefaultObjectView";
                return _this;
            }
            DefaultObjectView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                //
                this.blockViews = [];
                var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
                for (var i = 0; i < objectBlockInfos.length; i++) {
                    var displayObject = objectview.getBlockView(objectBlockInfos[i]);
                    displayObject.percentWidth = 100;
                    this.group.addChild(displayObject);
                    this.blockViews.push(displayObject);
                }
                this.$updateView();
            };
            Object.defineProperty(DefaultObjectView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.blockViews.length; i++) {
                        this.blockViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            DefaultObjectView.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.blockViews.length; i++) {
                    this.blockViews[i].updateView();
                }
            };
            /**
             * 更新自身界面
             */
            DefaultObjectView.prototype.$updateView = function () {
            };
            DefaultObjectView.prototype.getblockView = function (blockName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    if (this.blockViews[i].blockName == blockName) {
                        return this.blockViews[i];
                    }
                }
                return null;
            };
            DefaultObjectView.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    var attributeView = this.blockViews[i].getAttributeView(attributeName);
                    if (attributeView != null) {
                        return attributeView;
                    }
                }
                return null;
            };
            DefaultObjectView.prototype.onAddedToStage = function () {
                this.addEventListener(egret.Event.ENTER_FRAME, this.updateView, this);
            };
            DefaultObjectView.prototype.onRemovedFromStage = function () {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.updateView, this);
            };
            DefaultObjectView = __decorate([
                OVComponent()
            ], DefaultObjectView);
            return DefaultObjectView;
        }(eui.Component));
        editor.DefaultObjectView = DefaultObjectView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=DefaultObjectView.js.map