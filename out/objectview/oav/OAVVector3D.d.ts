declare namespace feng3d.editor {
    class OAVVector3D extends eui.Component implements IObjectAttributeView {
        private _space;
        private _attributeName;
        private _attributeType;
        private attributeViewInfo;
        label: eui.Label;
        vector3DView: feng3d.editor.Vector3DView;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onComplete();
        space: Object;
        readonly attributeName: string;
        attributeValue: Object;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
