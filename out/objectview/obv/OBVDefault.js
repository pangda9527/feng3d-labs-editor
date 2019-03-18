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
     * 默认对象属性块界面
     */
    var OBVDefault = /** @class */ (function (_super) {
        __extends(OBVDefault, _super);
        /**
         * @inheritDoc
         */
        function OBVDefault(blockViewInfo) {
            var _this = _super.call(this) || this;
            _this._space = blockViewInfo.owner;
            _this._blockName = blockViewInfo.name;
            _this.itemList = blockViewInfo.itemList;
            _this.skinName = "OBVDefault";
            return _this;
        }
        OBVDefault.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.initView();
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        };
        OBVDefault.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.dispose();
        };
        OBVDefault.prototype.initView = function () {
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
                var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
                displayObject.percentWidth = 100;
                displayObject.objectView = this.objectView;
                displayObject.objectBlockView = this;
                this.contentGroup.addChild(displayObject);
                this.attributeViews.push(displayObject);
            }
        };
        OBVDefault.prototype.dispose = function () {
            for (var i = 0; i < this.attributeViews.length; i++) {
                var displayObject = this.attributeViews[i];
                displayObject.objectView = null;
                displayObject.objectBlockView = null;
                this.contentGroup.removeChild(displayObject);
            }
            this.attributeViews.length = 0;
        };
        Object.defineProperty(OBVDefault.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].space = this._space;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBVDefault.prototype, "blockName", {
            get: function () {
                return this._blockName;
            },
            enumerable: true,
            configurable: true
        });
        OBVDefault.prototype.updateView = function () {
            for (var i = 0; i < this.attributeViews.length; i++) {
                this.attributeViews[i].updateView();
            }
        };
        OBVDefault.prototype.getAttributeView = function (attributeName) {
            for (var i = 0; i < this.attributeViews.length; i++) {
                if (this.attributeViews[i].attributeName == attributeName) {
                    return this.attributeViews[i];
                }
            }
            return null;
        };
        OBVDefault.prototype.onTitleButtonClick = function () {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        };
        OBVDefault = __decorate([
            feng3d.OBVComponent()
        ], OBVDefault);
        return OBVDefault;
    }(eui.Component));
    editor.OBVDefault = OBVDefault;
})(editor || (editor = {}));
//# sourceMappingURL=OBVDefault.js.map