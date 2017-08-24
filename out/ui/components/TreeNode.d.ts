declare namespace feng3d.editor {
    interface TreeNodeEventMap {
        added: TreeNode;
        removed: TreeNode;
        openChanged: TreeNode;
    }
    interface TreeNode {
        once<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeNodeEventMap>(type: K, data?: TreeNodeEventMap[K], bubbles?: boolean): any;
        has<K extends keyof TreeNodeEventMap>(type: K): boolean;
        on<K extends keyof TreeNodeEventMap>(type: K, listener: (event: TreeNodeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeNodeEventMap>(type?: K, listener?: (event: TreeNodeEventMap[K]) => any, thisObject?: any): any;
    }
    class TreeNode extends Event implements ITreeNode {
        label: string;
        depth: number;
        isOpen: boolean;
        /**
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
        constructor();
        /**
         * 判断是否包含节点
         */
        contain(node: TreeNode): boolean;
        addNode(node: TreeNode): void;
        removeNode(node: TreeNode): void;
        destroy(): void;
        updateChildrenDepth(): void;
        getShowNodes(): TreeNode[];
        onIsOpenChange(): void;
    }
}
