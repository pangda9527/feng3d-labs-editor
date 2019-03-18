declare namespace editor {
    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    class SplitGroup extends eui.Group {
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onMouseMove;
        private _findSplit;
        private onMouseDown;
        private onMouseUp;
    }
}
//# sourceMappingURL=SplitGroup.d.ts.map