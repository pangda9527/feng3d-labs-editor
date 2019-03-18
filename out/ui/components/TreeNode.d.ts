export interface TreeNodeMap {
    added: TreeNode;
    removed: TreeNode;
    openChanged: TreeNode;
}
export interface TreeNode {
    once<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => void, thisObject?: any, priority?: number): void;
    dispatch<K extends keyof TreeNodeMap>(type: K, data?: TreeNodeMap[K], bubbles?: boolean): feng3d.Event<TreeNodeMap[K]>;
    has<K extends keyof TreeNodeMap>(type: K): boolean;
    on<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
    off<K extends keyof TreeNodeMap>(type?: K, listener?: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any): any;
}
export declare class TreeNode extends feng3d.EventDispatcher {
    /**
     * 标签
     */
    label: string;
    /**
     * 目录深度
     */
    readonly depth: number;
    /**
     * 是否打开
     */
    isOpen: boolean;
    /**
     * 是否选中
     */
    selected: boolean;
    /**
     * 父结点
     */
    parent: TreeNode;
    /**
     * 子结点列表
     */
    children: TreeNode[];
    constructor(obj?: gPartial<TreeNode>);
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 判断是否包含结点
     */
    contain(node: TreeNode): boolean;
    addChild(node: TreeNode): void;
    remove(): void;
    getShowNodes(): TreeNode[];
    openParents(): void;
    private openChanged;
}
//# sourceMappingURL=TreeNode.d.ts.map