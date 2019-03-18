declare namespace editor {
    /**
     * 默认对象属性块界面
     */
    class OBVDefault extends eui.Component implements feng3d.IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        objectView: feng3d.IObjectView;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: feng3d.BlockViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initView(): void;
        dispose(): void;
        space: Object;
        readonly blockName: string;
        updateView(): void;
        getAttributeView(attributeName: String): feng3d.IObjectAttributeView;
        private onTitleButtonClick;
    }
}
//# sourceMappingURL=OBVDefault.d.ts.map