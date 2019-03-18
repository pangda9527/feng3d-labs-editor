import { TextInputBinder } from "./TextInputBinder";
export declare class NumberTextInputBinder extends TextInputBinder {
    /**
     * 步长，精度
     */
    step: number;
    /**
     * 键盘上下方向键步长
     */
    stepDownup: number;
    /**
     * 移动一个像素时增加的步长数量
     */
    stepScale: number;
    /**
     * 控制器
     */
    controller: egret.DisplayObject;
    /**
     * 最小值
     */
    minValue: number;
    /**
     * 最小值
     */
    maxValue: number;
    toText: (v: any) => string;
    toValue: (v: any) => number;
    initView(): void;
    dispose(): void;
    protected onValueChanged(): void;
    private mouseDownPosition;
    private mouseDownValue;
    private onMouseDown;
    private onStageMouseMove;
    private onStageMouseUp;
    protected ontxtfocusin(): void;
    protected ontxtfocusout(): void;
    private onWindowKeyDown;
}
//# sourceMappingURL=NumberTextInputBinder.d.ts.map