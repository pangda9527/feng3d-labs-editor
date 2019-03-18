declare var defaultTextFiled: egret.TextField;
declare function lostFocus(display: egret.DisplayObject): void;
/**
 * 重命名组件
 */
declare class RenameTextInput extends eui.Component implements eui.UIComponent {
    nameeditTxt: eui.TextInput;
    nameLabel: eui.Label;
    callback: () => void;
    /**
     * 显示文本
     */
    text: string;
    textAlign: string;
    constructor();
    /**
     * 启动编辑
     */
    edit(callback?: () => void): void;
    /**
     * 取消编辑
     */
    cancelEdit(): void;
    private onnameeditChanged;
}
//# sourceMappingURL=RenameTextInput.d.ts.map