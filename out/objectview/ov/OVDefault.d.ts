declare namespace feng3d {
    interface IObjectView extends eui.Component {
    }
    interface IObjectBlockView extends eui.Component {
    }
    interface IObjectAttributeView extends eui.Component {
    }
}
declare namespace editor {
    /**
     * 默认使用块的对象界面
     */
    class OVDefault extends eui.Component implements feng3d.IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initview(): void;
        dispose(): void;
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        getblockView(blockName: string): feng3d.IObjectBlockView;
        getAttributeView(attributeName: string): feng3d.IObjectAttributeView;
    }
}
//# sourceMappingURL=OVDefault.d.ts.map