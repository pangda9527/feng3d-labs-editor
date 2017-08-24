declare namespace feng3d.editor {
    class AssetsView extends eui.Component implements eui.UIComponent {
        list: eui.List;
        private listData;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private initlist();
    }
}
