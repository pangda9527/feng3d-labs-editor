module feng3d.editor
{
    export interface AssetsTreeNode extends TreeNode
    {
        path: string;
        /** 
         * 父节点
         */
        parent?: AssetsTreeNode;
        /**
         * 子节点列表
         */
        children: AssetsTreeNode[];

        fileinfo: FileInfo;
    }

    var assetsTreeNodeMap: { [path: string]: AssetsTreeNode } = {};

    export class AssetsTree extends Tree
    {
        rootnode: AssetsTreeNode;

        init(fileinfo: FileInfo)
        {
            this.rootnode = this.add(fileinfo);
        }

        getAssetsTreeNode(path: string)
        {
            return assetsTreeNodeMap[path];
        }

        remove(path: string)
        {
            var assetsTreeNode = assetsTreeNodeMap[path];
            if (assetsTreeNode)
                this.removeNode(assetsTreeNode);
        }

        removeNode(assetsTreeNode: AssetsTreeNode)
        {
            assetsTreeNode.children.forEach(element =>
            {
                this.removeNode(element);
            });
            super.removeNode(assetsTreeNode);
            delete assetsTreeNodeMap[assetsTreeNode.path];
        }

        add(fileinfo: FileInfo)
        {
            if (!fileinfo.isDirectory)
                return;
            if (assetsTreeNodeMap[fileinfo.path])
                return;
            assetsTreeNodeMap[fileinfo.path] = { isOpen: true, path: fileinfo.path, fileinfo: fileinfo, label: fileinfo.path.split("/").pop(), children: [] };
            var node = assetsTreeNodeMap[fileinfo.path];

            var parentdir = assets.getparentdir(fileinfo.path);
            var parentassetsTreeNode = this.getAssetsTreeNode(parentdir);
            if (parentassetsTreeNode)
            {
                this.addNode(node, parentassetsTreeNode);
                parentassetsTreeNode.children.sort((a, b) => { return a.label < b.label ? -1 : 1; });
            }

            for (var i = 0; i < fileinfo.children.length; i++)
            {
                var element = fileinfo.children[i];
                this.add(element);
            }
            return node;
        }

        getNode(path: string): AssetsTreeNode
        {
            return assetsTreeNodeMap[path];
        }
    }

    export var assetstree = new AssetsTree();
}