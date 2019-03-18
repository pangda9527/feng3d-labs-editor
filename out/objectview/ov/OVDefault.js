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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 默认使用块的对象界面
     */
    var OVDefault = /** @class */ (function (_super) {
        __extends(OVDefault, _super);
        /**
         * 对象界面数据
         */
        function OVDefault(objectViewInfo) {
            var _this = _super.call(this) || this;
            _this._objectViewInfo = objectViewInfo;
            _this._space = objectViewInfo.owner;
            _this.skinName = "OVDefault";
            return _this;
        }
        OVDefault.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            //
            this.initview();
            this.updateView();
        };
        OVDefault.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.dispose();
        };
        OVDefault.prototype.initview = function () {
            this.blockViews = [];
            var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
            for (var i = 0; i < objectBlockInfos.length; i++) {
                var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
                displayObject.percentWidth = 100;
                displayObject.objectView = this;
                this.group.addChild(displayObject);
                this.blockViews.push(displayObject);
            }
        };
        OVDefault.prototype.dispose = function () {
            if (!this.blockViews)
                return;
            for (var i = 0; i < this.blockViews.length; i++) {
                var displayObject = this.blockViews[i];
                displayObject.objectView = null;
                this.group.removeChild(displayObject);
            }
            this.blockViews = null;
        };
        Object.defineProperty(OVDefault.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
                this.dispose();
                this.initview();
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新界面
         */
        OVDefault.prototype.updateView = function () {
            if (!this.stage)
                return;
            for (var i = 0; i < this.blockViews.length; i++) {
                this.blockViews[i].updateView();
            }
        };
        OVDefault.prototype.getblockView = function (blockName) {
            for (var i = 0; i < this.blockViews.length; i++) {
                if (this.blockViews[i].blockName == blockName) {
                    return this.blockViews[i];
                }
            }
            return null;
        };
        OVDefault.prototype.getAttributeView = function (attributeName) {
            for (var i = 0; i < this.blockViews.length; i++) {
                var attributeView = this.blockViews[i].getAttributeView(attributeName);
                if (attributeView != null) {
                    return attributeView;
                }
            }
            return null;
        };
        OVDefault = __decorate([
            feng3d.OVComponent()
        ], OVDefault);
        return OVDefault;
    }(eui.Component));
    exports.OVDefault = OVDefault;
});
//# sourceMappingURL=OVDefault.js.map