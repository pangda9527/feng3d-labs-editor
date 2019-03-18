/// <reference path="../libs/typescriptServices.d.ts" />
export declare var scriptCompiler: ScriptCompiler;
export declare class ScriptCompiler {
    constructor();
    private onGettsLibs;
    /**
     * 加载 tslibs
     *
     * @param callback 完成回调
     */
    private loadtslibs;
    private onScriptCompile;
    private compile;
    private transpileModule;
    private createProgram;
}
//# sourceMappingURL=ScriptCompiler.d.ts.map