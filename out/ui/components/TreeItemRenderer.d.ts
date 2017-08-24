declare namespace feng3d.editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子节点相对父节点的缩进值，以像素为单位。默认17。
         */
        indentation: number;
        data: TreeNode;
        private watchers;
        private _dragOver;
        protected dragOver: boolean;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onDisclosureButtonClick();
        private updateView();
        private onItemMouseDown(event);
        private onMouseUp(event);
        private onMouseMove(event);
        private onDragEnter(event);
        private onDragExit(event);
        private onDragDrop(event);
    }
}
