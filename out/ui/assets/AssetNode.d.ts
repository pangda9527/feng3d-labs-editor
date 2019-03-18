import { TreeNodeMap, TreeNode } from "../components/TreeNode";
export interface AssetNodeEventMap extends TreeNodeMap {
    /**
     * 加载完成
     */
    loaded: any;
}
export interface AssetNode {
    once<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => void, thisObject?: any, priority?: number): void;
    dispatch<K extends keyof AssetNodeEventMap>(type: K, data?: AssetNodeEventMap[K], bubbles?: boolean): feng3d.Event<AssetNodeEventMap[K]>;
    has<K extends keyof AssetNodeEventMap>(type: K): boolean;
    on<K extends keyof AssetNodeEventMap>(type: K, listener: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
    off<K extends keyof AssetNodeEventMap>(type?: K, listener?: (event: feng3d.Event<AssetNodeEventMap[K]>) => any, thisObject?: any): any;
}
/**
 * 资源树结点
 */
export declare class AssetNode extends TreeNode {
    /**
     * 是否文件夹
     */
    isDirectory: boolean;
    /**
     * 图标名称或者路径
     */
    image: string;
    /**
     * 显示标签
     */
    label: string;
    children: AssetNode[];
    parent: AssetNode;
    asset: feng3d.FileAsset;
    /**
     * 是否已加载
     */
    isLoaded: boolean;
    /**
     * 是否加载中
     */
    private isLoading;
    /**
     * 构建
     *
     * @param asset 资源
     */
    constructor(asset: feng3d.FileAsset);
    /**
     * 加载
     *
     * @param callback 加载完成回调
     */
    load(callback?: () => void): void;
    /**
     * 更新缩略图
     */
    updateImage(): void;
    /**
     * 删除
     */
    delete(): void;
    /**
     * 获取文件夹列表
     *
     * @param includeClose 是否包含关闭的文件夹
     */
    getFolderList(includeClose?: boolean): AssetNode[];
    /**
     * 获取文件列表
     */
    getFileList(): AssetNode[];
    /**
     * 导出
     */
    export(): void;
}
//# sourceMappingURL=AssetNode.d.ts.map