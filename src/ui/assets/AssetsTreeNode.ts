namespace editor
{
    export var assetsTree: AssetsTree;

    export class AssetsTree
    {
        nodes: { [path: string]: AssetsTreeNode } = {};

        constructor()
        {
            feng3d.feng3dDispatcher.on("assets.showFloderChanged", this.onShowFloderChanged, this);
        }

        getNode(path: string)
        {
            var node = this.nodes[path];
            if (!node) node = this.nodes[path] = new AssetsTreeNode(path);
            if (path == editorAssets.showFloder)
                node.selected = true;
            return node;
        }

        private onShowFloderChanged(event: feng3d.Event<{ oldpath: string; newpath: string; }>)
        {
            var oldnode = this.getNode(event.data.oldpath);
            if (oldnode) oldnode.selected = false;
            var node = this.getNode(event.data.newpath);
            if (node) node.selected = true;
        }
    }

    assetsTree = new AssetsTree();

    export class AssetsTreeNode extends TreeNode
    {
        path: string;

        /**
         * 文件夹是否打开
         */
        @feng3d.watch("openChanged")
        isOpen = true;

        get label()
        {
            return this.assetsFile.label;
        }

        get parent()
        {
            var parentpath = feng3d.pathUtils.getParentPath(this.path);
            return assetsTree.nodes[parentpath];
        }

        get assetsFile()
        {
            return editorAssets.getFile(this.path);
        }

        children: AssetsTreeNode[] = [];

        constructor(path: string)
        {
            super();
            this.path = path;
            this.depth = feng3d.pathUtils.getDirDepth(path);
        }

        private openChanged()
        {
            editorui.assetsview.invalidateAssetstree();
        }
    }
}