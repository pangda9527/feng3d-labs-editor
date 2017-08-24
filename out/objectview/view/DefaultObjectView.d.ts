declare namespace feng3d {
    interface IObjectView extends eui.Component {
    }
}
declare namespace feng3d.editor {
    /**
     * 默认使用块的对象界面
     * @author feng 2016-3-22
     */
    class DefaultObjectView extends eui.Component implements IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: ObjectViewInfo);
        private onComplete();
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        /**
         * 更新自身界面
         */
        private $updateView();
        getblockView(blockName: string): IObjectBlockView;
        getAttributeView(attributeName: string): IObjectAttributeView;
        private onAddedToStage();
        private onRemovedFromStage();
    }
}
