export declare class MainUI extends eui.UILayer {
    onComplete: () => void;
    constructor(onComplete?: () => void);
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView;
    protected createChildren(): void;
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete;
    private isThemeLoadEnd;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    private onThemeLoadComplete;
    private isResourceLoadEnd;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete;
    private createScene;
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError;
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError;
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress;
}
//# sourceMappingURL=MainUI.d.ts.map