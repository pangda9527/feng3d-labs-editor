declare namespace feng3d.editor {
    /**
     * 默认对象属性块界面
     * @author feng 2016-3-22
     */
    class DefaultObjectBlockView extends eui.Component implements IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        private isInitView;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: BlockViewInfo);
        private onComplete();
        private initView();
        space: Object;
        readonly blockName: string;
        /**
         * 更新自身界面
         */
        private $updateView();
        updateView(): void;
        getAttributeView(attributeName: String): IObjectAttributeView;
        private onTitleButtonClick();
    }
}
