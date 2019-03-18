"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var TreeNode = /** @class */ (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(obj) {
        var _this = _super.call(this) || this;
        /**
         * 标签
         */
        _this.label = "";
        /**
         * 是否打开
         */
        _this.isOpen = false;
        /**
         * 是否选中
         */
        _this.selected = false;
        /**
         * 父结点
         */
        _this.parent = null;
        if (obj) {
            Object.assign(_this, obj);
        }
        return _this;
    }
    Object.defineProperty(TreeNode.prototype, "depth", {
        /**
         * 目录深度
         */
        get: function () {
            var d = 0;
            var p = this.parent;
            while (p) {
                d++;
                p = p.parent;
            }
            return d;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 销毁
     */
    TreeNode.prototype.destroy = function () {
        if (this.children) {
            this.children.concat().forEach(function (element) {
                element.destroy();
            });
        }
        this.remove();
        this.parent = null;
        this.children = null;
    };
    /**
     * 判断是否包含结点
     */
    TreeNode.prototype.contain = function (node) {
        while (node) {
            if (node == this)
                return true;
            node = node.parent;
        }
        return false;
    };
    TreeNode.prototype.addChild = function (node) {
        node.remove();
        feng3d.assert(!node.contain(this), "无法添加到自身结点中!");
        if (this.children.indexOf(node) == -1)
            this.children.push(node);
        node.parent = this;
        this.dispatch("added", node, true);
    };
    TreeNode.prototype.remove = function () {
        if (this.parent) {
            var index = this.parent.children.indexOf(this);
            if (index != -1)
                this.parent.children.splice(index, 1);
            this.dispatch("removed", this, true);
            this.parent = null;
        }
    };
    TreeNode.prototype.getShowNodes = function () {
        var nodes = [this];
        if (this.isOpen) {
            this.children.forEach(function (element) {
                nodes = nodes.concat(element.getShowNodes());
            });
        }
        return nodes;
    };
    TreeNode.prototype.openParents = function () {
        var p = this.parent;
        while (p) {
            p.isOpen = true;
            p = p.parent;
        }
    };
    TreeNode.prototype.openChanged = function () {
        this.dispatch("openChanged", null, true);
    };
    __decorate([
        feng3d.watch("openChanged")
    ], TreeNode.prototype, "isOpen", void 0);
    return TreeNode;
}(feng3d.EventDispatcher));
exports.TreeNode = TreeNode;
//# sourceMappingURL=TreeNode.js.map