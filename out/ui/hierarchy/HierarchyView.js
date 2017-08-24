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
        var HierarchyView = (function (_super) {
            __extends(HierarchyView, _super);
            function HierarchyView() {
                var _this = _super.call(this) || this;
                _this.watchers = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "HierarchyViewSkin";
                return _this;
            }
            HierarchyView.prototype.onComplete = function () {
                this.list.itemRenderer = editor.HierarchyTreeItemRenderer;
                this.listData = this.list.dataProvider = new eui.ArrayCollection();
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            HierarchyView.prototype.onAddedToStage = function () {
                this.addButton.addEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.editor3DData.hierarchy.rootNode.on("added", this.onHierarchyNodeAdded, this);
                editor.editor3DData.hierarchy.rootNode.on("removed", this.onHierarchyNodeRemoved, this);
                editor.editor3DData.hierarchy.rootNode.on("openChanged", this.onHierarchyNodeRemoved, this);
                this.list.addEventListener(egret.Event.CHANGE, this.onListChange, this);
                this.watchers.push(eui.Watcher.watch(editor.editor3DData, ["selectedObject"], this.selectedObject3DChanged, this));
            };
            HierarchyView.prototype.onRemovedFromStage = function () {
                this.addButton.removeEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.editor3DData.hierarchy.rootNode.off("added", this.onHierarchyNodeAdded, this);
                editor.editor3DData.hierarchy.rootNode.off("removed", this.onHierarchyNodeRemoved, this);
                editor.editor3DData.hierarchy.rootNode.off("openChanged", this.onHierarchyNodeRemoved, this);
                this.list.removeEventListener(egret.Event.CHANGE, this.onListChange, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
            };
            HierarchyView.prototype.onListChange = function () {
                var node = this.list.selectedItem;
                editor.editor3DData.selectedObject = node.object3D;
            };
            HierarchyView.prototype.onHierarchyNodeAdded = function () {
                var nodes = editor.editor3DData.hierarchy.rootNode.getShowNodes();
                this.listData.replaceAll(nodes);
            };
            HierarchyView.prototype.onHierarchyNodeRemoved = function () {
                var nodes = editor.editor3DData.hierarchy.rootNode.getShowNodes();
                this.listData.replaceAll(nodes);
                this.list.selectedItem = editor.editor3DData.hierarchy.selectedNode;
            };
            HierarchyView.prototype.selectedObject3DChanged = function () {
                var node = editor.editor3DData.hierarchy.getNode(editor.editor3DData.selectedObject ? editor.editor3DData.selectedObject : null);
                this.list.selectedIndex = this.listData.getItemIndex(node);
            };
            HierarchyView.prototype.onAddButtonClick = function () {
                var globalPoint = this.addButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(createObjectConfig, this.onCreateObject3d, globalPoint);
            };
            HierarchyView.prototype.onCreateObject3d = function (selectedItem) {
                editor.$editorEventDispatcher.dispatch("Create_Object3D", selectedItem);
            };
            return HierarchyView;
        }(eui.Component));
        editor.HierarchyView = HierarchyView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=HierarchyView.js.map