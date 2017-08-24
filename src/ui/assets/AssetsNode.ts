namespace feng3d.editor
{
    export class AssetsNode extends TreeNode
    {

        /** 
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[] = [];

        private fileInfo: FileInfo;

        get label()
        {
            return this.fileInfo.path.split("/").pop();
        }

        constructor(fileInfo: FileInfo)
        {
            super();
            this.fileInfo = fileInfo;
            if (fileInfo.children && fileInfo.children.length > 0)
            {
                fileInfo.children.forEach(element =>
                {
                    this.addNode(new AssetsNode(element));
                });
            }
        }
    }
}