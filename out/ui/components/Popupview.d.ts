/**
 * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
 */
export declare var popupview: Popupview;
/**
 * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
 */
export declare class Popupview {
    popupObject<T>(object: T, closecallback?: (object: T) => void, x?: number, y?: number, width?: number, height?: number): void;
    popupView(view: eui.Component, closecallback?: () => void, x?: number, y?: number, width?: number, height?: number): void;
}
//# sourceMappingURL=Popupview.d.ts.map