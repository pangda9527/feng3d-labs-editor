declare namespace feng3d.editor {
    class Hierarchy {
        readonly rootNode: HierarchyNode;
        readonly selectedNode: HierarchyNode;
        constructor(rootObject3D: GameObject);
        /**
         * 获取节点
         */
        getNode(object3D: GameObject): HierarchyNode;
        addObject3D(object3D: GameObject, parentNode?: HierarchyNode, allChildren?: boolean): HierarchyNode;
        private onMouseClick(event);
        private onCreateObject3D(event);
        private onDeleteSeletedObject3D();
        resetScene(scene: GameObject): void;
        private onImport();
        private onSaveScene();
    }
}
