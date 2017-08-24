declare namespace feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class DefaultObjectAttributeView extends eui.Component implements IObjectAttributeView {
        private textTemp;
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        label: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        space: Object;
        readonly attributeName: string;
        attributeValue: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        private onClick();
        private onTextChange();
    }
}
