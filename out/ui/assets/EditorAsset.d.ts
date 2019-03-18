import { AssetNode } from "./AssetNode";
export declare var editorAsset: EditorAsset;
export declare class EditorAsset {
    /**
     * 资源ID字典
     */
    private _assetIDMap;
    /**
     * 显示文件夹
     */
    showFloder: AssetNode;
    /**
     * 项目资源id树形结构
     */
    rootFile: AssetNode;
    constructor();
    /**
     * 初始化项目
     * @param callback
     */
    initproject(callback: () => void): void;
    readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void): void;
    /**
     * 根据资源编号获取文件
     *
     * @param assetId 文件路径
     */
    getAssetByID(assetId: string): AssetNode;
    /**
     * 删除资源
     *
     * @param assetNode 资源
     */
    deleteAsset(assetNode: AssetNode, callback?: (err: Error) => void): void;
    /**
     * 保存资源
     *
     * @param assetNode 资源
     * @param callback 完成回调
     */
    saveAsset(assetNode: AssetNode, callback?: () => void): void;
    /**
     * 新增资源
     *
     * @param feng3dAssets
     */
    createAsset<T extends feng3d.FileAsset>(folderNode: AssetNode, cls: new () => T, value?: gPartial<T>, callback?: (err: Error, assetNode: AssetNode) => void): void;
    /**
     * 弹出文件菜单
     */
    popupmenu(assetNode: AssetNode): void;
    /**
     * 保存对象
     *
     * @param object 对象
     * @param callback
     */
    saveObject(object: feng3d.AssetData, callback?: (file: AssetNode) => void): void;
    /**
     *
     * @param files 需要导入的文件列表
     * @param callback 完成回调
     * @param assetNodes 生成资源文件列表（不用赋值，函数递归时使用）
     */
    inputFiles(files: File[], callback?: (files: AssetNode[]) => void, assetNodes?: AssetNode[]): void;
    runProjectScript(callback?: () => void): void;
    /**
     * 上次执行的项目脚本
     */
    private _preProjectJsContent;
    /**
     * 解析菜单
     * @param menuconfig 菜单
     * @param assetNode 文件
     */
    private parserMenu;
    private showFloderChanged;
    private onParsed;
}
//# sourceMappingURL=EditorAsset.d.ts.map