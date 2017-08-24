declare namespace feng3d.editor {
    class OAVObject3DComponentList extends eui.Component implements IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        private accordions;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        private onAddComponentButtonClick();
        private onCreateComponent(item);
        space: GameObject;
        readonly attributeName: string;
        attributeValue: Object;
        private initView();
        private addComponentView(component);
        /**
         * 更新界面
         */
        updateView(): void;
        private onDeleteButton(event);
    }
}
