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
    var TreeItemRenderer = /** @class */ (function (_super) {
        __extends(TreeItemRenderer, _super);
        function TreeItemRenderer() {
            var _this = _super.call(this) || this;
            /**
             * 子结点相对父结点的缩进值，以像素为单位。默认17。
             */
            _this.indentation = 17;
            _this.watchers = [];
            _this.skinName = "TreeItemRendererSkin";
            return _this;
        }
        TreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            //
            this.disclosureButton.addEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
            this.updateView();
        };
        TreeItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            while (this.watchers.length > 0) {
                this.watchers.pop().unwatch();
            }
            //
            this.disclosureButton.removeEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
        };
        TreeItemRenderer.prototype.onDisclosureButtonClick = function () {
            if (this.data)
                this.data.isOpen = !this.data.isOpen;
        };
        TreeItemRenderer.prototype.updateView = function () {
            this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
            this.contentGroup.left = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        };
        return TreeItemRenderer;
    }(eui.ItemRenderer));
    exports.TreeItemRenderer = TreeItemRenderer;
});
//# sourceMappingURL=TreeItemRenderer.js.map