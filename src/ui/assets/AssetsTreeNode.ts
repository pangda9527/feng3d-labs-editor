namespace feng3d.editor
{
    export var assetsTree: AssetsTree;

    export class AssetsTree
    {
        nodes: { [path: string]: AssetsTreeNode } = {};

        constructor()
        {
            feng3dDispatcher.on("assets.showFloderChanged", this.onShowFloderChanged, this);
        }

        getNode(path: string)
        {
            var node = this.nodes[path];
            if (!node) node = this.nodes[path] = new AssetsTreeNode(path);
            if (path == editorAssets.showFloder)
                node.selected = true;
            return node;
        }

        private onShowFloderChanged(event: Event<{ oldpath: string; newpath: string; }>)
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
        @watch("openChanged")
        isOpen = true;

        get label()
        {
            return this.assetsFile.label;
        }

        get parent()
        {
            var parentpath = pathUtils.getParentPath(this.path);
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
            this.depth = pathUtils.getDirDepth(path);
        }

        private openChanged()
        {
            editorui.assetsview.invalidateAssetstree();
        }
    }
}