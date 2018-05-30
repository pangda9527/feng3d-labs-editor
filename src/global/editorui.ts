namespace editor
{
    export interface EditorUI
    {
        stage: egret.Stage;
        assetsview: AssetsView;
        mainview: MainView;
        tooltipLayer: eui.UILayer;
        maskLayer: eui.UILayer;
        popupLayer: eui.UILayer;

        /**
         * 属性面板
         */
        inspectorView: InspectorView;
    }

    export var editorui: EditorUI = <any>{};
}