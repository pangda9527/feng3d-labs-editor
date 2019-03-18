import { TipString } from "./tipviews/TipString";
export declare var toolTip: ToolTip;
export interface ITipView extends egret.DisplayObject {
    value: any;
}
export declare class ToolTip {
    /**
     * 默认 提示界面
     */
    defaultTipview: () => typeof TipString;
    /**
     * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
     */
    tipviewmap: Map<any, new () => ITipView>;
    private tipmap;
    private tipView;
    register(displayObject: egret.DisplayObject, tip: any): void;
    unregister(displayObject: egret.DisplayObject): void;
    private onMouseOver;
    private onMouseOut;
    private removeTipview;
}
//# sourceMappingURL=ToolTip.d.ts.map