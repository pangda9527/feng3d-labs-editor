namespace editor
{
    export class AssetsTreeNode extends TreeNode
    {
        path: string;

        /**
         * 文件夹是否打开
         */
        @feng3d.watch("openChanged")
        isOpen = true;

        children: AssetsTreeNode[] = [];

        constructor()
        {
            super();
        }

        private openChanged()
        {
            editorui.assetsview.invalidateAssetstree();
        }
    }
}