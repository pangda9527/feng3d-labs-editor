namespace feng3d.editor
{
    export interface TreeNodeEventMap
    {
        added: TreeNode;
        removed: TreeNode;
        openChanged: TreeNode;
    }

    export interface TreeNode
    {
        once<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeNodeEventMap>(type: K, data?: TreeNodeEventMap[K], bubbles?: boolean);
        has<K extends keyof TreeNodeEventMap>(type: K): boolean;
        on<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof TreeNodeEventMap>(type?: K, listener?: (event: TreeNodeEventMap[K]) => any, thisObject?: any);
    }

    export class TreeNode extends Event
    {
        label: string;
        depth: number = 0;
        isOpen: boolean = true;
        hasChildren: boolean;

        /** 
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[] = [];

        constructor()
        {
            super();

            eui.Watcher.watch(this, ["isOpen"], this.onIsOpenChange, this);
        }

        /**
         * 判断是否包含节点
         */
        contain(node: TreeNode)
        {
            if (this == node)
                return true;
            for (var i = 0; i < this.children.length; i++)
            {
                if (this.children[i].contain(node))
                    return true;
            }
            return false;
        }

        addNode(node: TreeNode)
        {
            debuger && console.assert(!node.contain(this), "无法添加到自身节点中!");

            node.parent = this;
            this.children.push(node);
            node.depth = this.depth + 1;
            node.updateChildrenDepth();
            this.hasChildren = true;
            this.dispatch("added", node, true);
        }

        removeNode(node: TreeNode)
        {
            node.parent = null;
            var index = this.children.indexOf(node);
            debuger && console.assert(index != -1);
            this.children.splice(index, 1);
            this.hasChildren = this.children.length > 0;
            this.dispatch("removed", node, true);
        }

        destroy()
        {
            if (this.parent)
                this.parent.removeNode(this);
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].destroy();
            }
            this.children.length = 0;
        }

        updateChildrenDepth()
        {
            this.children.forEach(element =>
            {
                element.depth = this.depth + 1;
                element.updateChildrenDepth();
            });
        }

        getShowNodes()
        {
            var nodes: TreeNode[] = [];
            if (this.isOpen)
            {
                this.children.forEach(element =>
                {
                    nodes.push(element);
                    nodes = nodes.concat(element.getShowNodes());
                });
            }
            return nodes;
        }

        onIsOpenChange()
        {
            this.dispatch("openChanged", this, true);
        }
    }
}