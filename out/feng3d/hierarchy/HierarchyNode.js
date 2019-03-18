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
define(["require", "exports", "../../ui/components/TreeNode"], function (require, exports, TreeNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HierarchyNode = /** @class */ (function (_super) {
        __extends(HierarchyNode, _super);
        function HierarchyNode(obj) {
            var _this = _super.call(this, obj) || this;
            _this.isOpen = false;
            /**
             * 父结点
             */
            _this.parent = null;
            /**
             * 子结点列表
             */
            _this.children = [];
            feng3d.watcher.watch(_this.gameobject, "name", _this.update, _this);
            _this.update();
            return _this;
        }
        /**
         * 销毁
         */
        HierarchyNode.prototype.destroy = function () {
            feng3d.watcher.unwatch(this.gameobject, "name", this.update, this);
            this.gameobject = null;
            _super.prototype.destroy.call(this);
        };
        HierarchyNode.prototype.update = function () {
            this.label = this.gameobject.name;
        };
        return HierarchyNode;
    }(TreeNode_1.TreeNode));
    exports.HierarchyNode = HierarchyNode;
});
//# sourceMappingURL=HierarchyNode.js.map