declare namespace feng3d.editor {
    /**
     * 巡视界面
     * @author feng     2017-03-20
     */
    class InspectorView extends eui.Component implements eui.UIComponent {
        backButton: eui.Button;
        group: eui.Group;
        private view;
        private inspectorViewData;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onDataChange();
        private updateView();
        private onBackClick();
    }
}
