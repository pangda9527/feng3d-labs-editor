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
        var AssetsView = (function (_super) {
            __extends(AssetsView, _super);
            function AssetsView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "AssetsView";
                return _this;
            }
            AssetsView.prototype.onComplete = function () {
                this.list.itemRenderer = editor.TreeItemRenderer;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            AssetsView.prototype.onAddedToStage = function () {
                this.listData = this.list.dataProvider = new eui.ArrayCollection();
                this.initlist();
            };
            AssetsView.prototype.onRemovedFromStage = function () {
            };
            AssetsView.prototype.initlist = function () {
                var _this = this;
                editor.project.init(editor.editor3DData.projectRoot, function (err, fileInfo) {
                    var rootNode = new editor.AssetsNode(fileInfo);
                    // var rootNode = new TreeNode();
                    // rootNode.label = "root";
                    // rootNode.depth = -1;
                    // var AssetsNode = new TreeNode();
                    // AssetsNode.label = "Assets";
                    // rootNode.addNode(AssetsNode);
                    var nodes = rootNode.getShowNodes();
                    _this.listData.replaceAll(nodes);
                    rootNode.on("openChanged", function () {
                        var nodes = rootNode.getShowNodes();
                        _this.listData.replaceAll(nodes);
                    }, _this);
                });
            };
            return AssetsView;
        }(eui.Component));
        editor.AssetsView = AssetsView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=AssetsView.js.map