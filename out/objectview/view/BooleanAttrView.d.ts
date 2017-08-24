declare namespace feng3d.editor {
    class BooleanAttrView extends eui.Component implements feng3d.IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        label: eui.Label;
        checkBox: eui.CheckBox;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        private onComplete();
        space: any;
        updateView(): void;
        protected onChange(event: egret.Event): void;
        readonly attributeName: string;
        attributeValue: any;
    }
}
