declare namespace feng3d.editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        addButton: eui.Button;
        list: eui.List;
        private listData;
        private watchers;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onListChange();
        private onHierarchyNodeAdded();
        private onHierarchyNodeRemoved();
        private selectedObject3DChanged();
        private onAddButtonClick();
        private onCreateObject3d(selectedItem);
    }
}
