namespace editor
{
    export interface EditorUI
    {
        stage: egret.Stage;
        assetview: AssetView;
        mainview: MainView;
        tooltipLayer: eui.UILayer;
        popupLayer: eui.UILayer;

        /**
         * 3D视图
         */
        feng3dView: Feng3dView;
    }

    export var editorui: EditorUI = <any>{};
}