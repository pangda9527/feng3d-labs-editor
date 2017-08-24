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
        var TreeItemRenderer = (function (_super) {
            __extends(TreeItemRenderer, _super);
            function TreeItemRenderer() {
                var _this = _super.call(this) || this;
                /**
                 * 子节点相对父节点的缩进值，以像素为单位。默认17。
                 */
                _this.indentation = 17;
                _this.watchers = [];
                _this._dragOver = false;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "TreeItemRendererSkin";
                return _this;
            }
            Object.defineProperty(TreeItemRenderer.prototype, "dragOver", {
                get: function () {
                    return this._dragOver;
                },
                set: function (value) {
                },
                enumerable: true,
                configurable: true
            });
            TreeItemRenderer.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            TreeItemRenderer.prototype.onAddedToStage = function () {
                this.addEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);
                this.addEventListener(editor.DragEvent.DRAG_ENTER, this.onDragEnter, this);
                this.addEventListener(editor.DragEvent.DRAG_EXIT, this.onDragExit, this);
                this.addEventListener(editor.DragEvent.DRAG_DROP, this.onDragDrop, this);
                //
                this.disclosureButton.addEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
                this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
                this.updateView();
            };
            TreeItemRenderer.prototype.onRemovedFromStage = function () {
                this.removeEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
                this.removeEventListener(editor.DragEvent.DRAG_ENTER, this.onDragEnter, this);
                this.removeEventListener(editor.DragEvent.DRAG_EXIT, this.onDragExit, this);
                this.removeEventListener(editor.DragEvent.DRAG_DROP, this.onDragDrop, this);
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
                eui.Watcher.watch(this, ["indentation"], this.updateView, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
                //
                this.disclosureButton.removeEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            };
            TreeItemRenderer.prototype.onDisclosureButtonClick = function () {
                if (this.data)
                    this.data.isOpen = !this.data.isOpen;
            };
            TreeItemRenderer.prototype.updateView = function () {
                this.disclosureButton.visible = this.data ? this.data.children.length > 0 : false;
                this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
                this.disclosureButton.selected = this.data ? this.data.isOpen : false;
            };
            TreeItemRenderer.prototype.onItemMouseDown = function (event) {
                if (event.target == this.disclosureButton) {
                    event.stopImmediatePropagation();
                    return;
                }
                this.stage.once(editor.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
                this.stage.once(editor.MouseEvent.MOUSE_UP, this.onMouseUp, this);
            };
            TreeItemRenderer.prototype.onMouseUp = function (event) {
                this.stage.removeEventListener(editor.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            };
            TreeItemRenderer.prototype.onMouseMove = function (event) {
                var dragSource = new editor.DragSource();
                dragSource.addData(this.data, editor.DragType.HierarchyNode);
                editor.DragManager.doDrag(this, dragSource);
            };
            TreeItemRenderer.prototype.onDragEnter = function (event) {
                var node = event.dragSource.dataForFormat(editor.DragType.HierarchyNode);
                if (node && this.data != node) {
                    editor.DragManager.acceptDragDrop(this);
                }
            };
            TreeItemRenderer.prototype.onDragExit = function (event) {
            };
            TreeItemRenderer.prototype.onDragDrop = function (event) {
                var node = event.dragSource.dataForFormat(editor.DragType.HierarchyNode);
                var iscontain = node.contain(this.data);
                if (iscontain) {
                    alert("无法添加到自身节点中!");
                    return;
                }
                if (node.parent) {
                    node.parent.removeNode(node);
                }
                this.data.addNode(node);
            };
            return TreeItemRenderer;
        }(eui.ItemRenderer));
        editor.TreeItemRenderer = TreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=TreeItemRenderer.js.map