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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Accordion = /** @class */ (function (_super) {
        __extends(Accordion, _super);
        function Accordion() {
            var _this = _super.call(this) || this;
            /**
             * 标签名称
             */
            _this.titleName = "";
            _this.components = [];
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "Accordion";
            return _this;
        }
        Accordion.prototype.addContent = function (component) {
            if (!this.contentGroup)
                this.components.push(component);
            else
                this.contentGroup.addChild(component);
        };
        Accordion.prototype.removeContent = function (component) {
            var index = this.components ? this.components.indexOf(component) : -1;
            if (index != -1)
                this.components.splice(index, 1);
            else
                component.parent && component.parent.removeChild(component);
        };
        Accordion.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        Accordion.prototype.onAddedToStage = function () {
            this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.titleLabel.text = this.titleName;
            if (this.components) {
                for (var i = 0; i < this.components.length; i++) {
                    this.contentGroup.addChild(this.components[i]);
                }
                this.components = null;
                delete this.components;
            }
        };
        Accordion.prototype.onRemovedFromStage = function () {
            this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        };
        Accordion.prototype.onTitleButtonClick = function () {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        };
        return Accordion;
    }(eui.Component));
    exports.Accordion = Accordion;
});
//# sourceMappingURL=Accordion.js.map