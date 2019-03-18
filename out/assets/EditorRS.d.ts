/**
 * 编辑器资源系统
 */
export declare var editorRS: EditorRS;
/**
 * 编辑器资源系统
 */
export declare class EditorRS extends feng3d.ReadWriteRS {
    /**
     * 初始化项目
     *
     * @param callback 完成回调
     */
    initproject(callback: (err?: Error) => void): void;
    /**
     * 创建项目
     */
    private createproject;
    upgradeProject(callback: () => void): void;
    selectFile(callback: (file: FileList) => void): void;
    /**
     * 导出项目
     */
    exportProject(callback: (err: Error, data: Blob) => void): void;
    /**
     * 导入项目
     */
    importProject(file: File, callback: () => void): void;
}
//# sourceMappingURL=EditorRS.d.ts.map