export declare class EditorCache {
    /**
     * 保存最后一次打开的项目路径
     */
    projectname: string;
    /**
     * 最近的项目列表
     */
    lastProjects: string[];
    /**
     * 设置最近打开的项目
     */
    setLastProject(projectname: string): void;
    constructor();
    save(): void;
}
export declare var editorcache: EditorCache;
//# sourceMappingURL=Editorcache.d.ts.map