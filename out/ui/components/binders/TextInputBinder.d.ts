export interface Component {
    addBinder(...binders: UIBinder[]): void;
}
export interface UIBinder {
    init(v: Partial<this>): this;
    dispose(): void;
}
export interface TextInputBinderEventMap {
    valueChanged: any;
}
export interface TextInputBinder {
    once<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => void, thisObject?: any, priority?: number): void;
    dispatch<K extends keyof TextInputBinderEventMap>(type: K, data?: TextInputBinderEventMap[K], bubbles?: boolean): feng3d.Event<TextInputBinderEventMap[K]>;
    has<K extends keyof TextInputBinderEventMap>(type: K): boolean;
    on<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
    off<K extends keyof TextInputBinderEventMap>(type?: K, listener?: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any): any;
}
export declare class TextInputBinder extends feng3d.EventDispatcher implements UIBinder {
    space: any;
    /**
     * 绑定属性名称
     */
    attribute: string;
    textInput: eui.TextInput;
    /**
     * 是否可编辑
     */
    editable: boolean;
    /**
     * 绑定属性值转换为文本
     */
    toText: (v: any) => any;
    /**
     * 文本转换为绑定属性值
     */
    toValue: (v: any) => any;
    init(v: Partial<this>): this;
    dispose(): void;
    protected initView(): void;
    protected onValueChanged(): void;
    protected updateView(): void;
    protected onTextChange(): void;
    private _textfocusintxt;
    protected ontxtfocusin(): void;
    protected ontxtfocusout(): void;
}
//# sourceMappingURL=TextInputBinder.d.ts.map