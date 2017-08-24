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
        var AssetsNode = (function (_super) {
            __extends(AssetsNode, _super);
            function AssetsNode(fileInfo) {
                var _this = _super.call(this) || this;
                /**
                 * 子节点列表
                 */
                _this.children = [];
                _this.fileInfo = fileInfo;
                if (fileInfo.children && fileInfo.children.length > 0) {
                    fileInfo.children.forEach(function (element) {
                        _this.addNode(new AssetsNode(element));
                    });
                }
                return _this;
            }
            Object.defineProperty(AssetsNode.prototype, "label", {
                get: function () {
                    return this.fileInfo.path.split("/").pop();
                },
                enumerable: true,
                configurable: true
            });
            return AssetsNode;
        }(editor.TreeNode));
        editor.AssetsNode = AssetsNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=AssetsNode.js.map