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
        var HierarchyTreeItemRenderer = (function (_super) {
            __extends(HierarchyTreeItemRenderer, _super);
            function HierarchyTreeItemRenderer() {
                return _super.call(this) || this;
            }
            return HierarchyTreeItemRenderer;
        }(editor.TreeItemRenderer));
        editor.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=HierarchyTreeItemRenderer.js.map