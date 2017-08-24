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
        var HierarchyNode = (function (_super) {
            __extends(HierarchyNode, _super);
            function HierarchyNode(object3D) {
                var _this = _super.call(this) || this;
                /**
                 * 子节点列表
                 */
                _this.children = [];
                _this.object3D = object3D;
                _this.label = object3D.name;
                return _this;
            }
            HierarchyNode.prototype.addNode = function (node) {
                _super.prototype.addNode.call(this, node);
                this.object3D.addChild(node.object3D);
            };
            HierarchyNode.prototype.removeNode = function (node) {
                _super.prototype.removeNode.call(this, node);
                this.object3D.removeChild(node.object3D);
            };
            return HierarchyNode;
        }(editor.TreeNode));
        editor.HierarchyNode = HierarchyNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=HierarchyNode.js.map