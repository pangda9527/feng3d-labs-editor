export declare var areaSelectRect: AreaSelectRect;
/**
 * 区域选择框
 */
export declare class AreaSelectRect extends eui.Rect {
    fillAlpha: number;
    fillColor: number;
    /**
     * 显示
     * @param start 起始位置
     * @param end 结束位置
     */
    show(start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }): void;
    /**
     * 隐藏
     */
    hide(): void;
}
//# sourceMappingURL=AreaSelectRect.d.ts.map