declare namespace feng3d.editor {
    /**
     * 默认基础对象界面
     * @author feng 2016-3-11
     */
    class DefaultBaseObjectView extends eui.Component implements IObjectView {
        private _space;
        label: eui.Label;
        constructor(objectViewInfo: ObjectViewInfo);
        private onComplete();
        space: Object;
        getAttributeView(attributeName: String): IObjectAttributeView;
        getblockView(blockName: String): IObjectBlockView;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
