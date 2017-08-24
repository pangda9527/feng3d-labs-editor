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
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        function treeMap(treeNode, callback) {
            if (treeNode.children) {
                treeNode.children.forEach(function (element) {
                    callback(element, treeNode);
                    treeMap(element, callback);
                });
            }
        }
        var TreeNode = (function (_super) {
            __extends(TreeNode, _super);
            function TreeNode() {
                var _this = _super.call(this) || this;
                _this.depth = 0;
                _this.isOpen = true;
                /**
                 * 子节点列表
                 */
                _this.children = [];
                eui.Watcher.watch(_this, ["isOpen"], _this.onIsOpenChange, _this);
                return _this;
            }
            /**
             * 判断是否包含节点
             */
            TreeNode.prototype.contain = function (node) {
                var result = false;
                treeMap(this, function (item) {
                    if (item == node)
                        result = true;
                });
                return result;
            };
            TreeNode.prototype.addNode = function (node) {
                feng3d.debuger && console.assert(!node.contain(this), "无法添加到自身节点中!");
                node.parent = this;
                this.children.push(node);
                node.depth = this.depth + 1;
                node.updateChildrenDepth();
                this.dispatch("added", node, true);
            };
            TreeNode.prototype.removeNode = function (node) {
                node.parent = null;
                var index = this.children.indexOf(node);
                feng3d.debuger && console.assert(index != -1);
                this.children.splice(index, 1);
                this.dispatch("removed", node, true);
            };
            TreeNode.prototype.destroy = function () {
                if (this.parent)
                    this.parent.removeNode(this);
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].destroy();
                }
                this.children.length = 0;
            };
            TreeNode.prototype.updateChildrenDepth = function () {
                treeMap(this, function (node, parent) {
                    node.depth = parent.depth + 1;
                });
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
            TreeNode.prototype.onIsOpenChange = function () {
                this.dispatch("openChanged", this, true);
            };
            return TreeNode;
        }(feng3d.Event));
        editor.TreeNode = TreeNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=TreeNode.js.map