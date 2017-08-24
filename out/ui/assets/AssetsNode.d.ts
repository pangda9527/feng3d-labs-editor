declare namespace feng3d.editor {
    class AssetsNode extends TreeNode {
        /**
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
        private fileInfo;
        readonly label: string;
        constructor(fileInfo: FileInfo);
    }
}
