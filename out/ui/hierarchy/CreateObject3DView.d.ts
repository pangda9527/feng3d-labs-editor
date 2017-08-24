declare namespace feng3d.editor {
    class CreateObject3DView extends eui.Component implements eui.UIComponent {
        object3dList: eui.List;
        maskSprite: eui.Rect;
        private _dataProvider;
        private _selectedCallBack;
        constructor();
        showView(data: {
            label: string;
        }[], selectedCallBack: (item: {
            label: string;
        }) => void, globalPoint?: {
            x: number;
            y: number;
        }): void;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onObject3dListChange();
        private maskMouseDown();
    }
}
