module feng3d.editor
{
    export interface EditorUI
    {
        stage: egret.Stage;
        assetsview: AssetsView;
        mainview: MainView;
        maskLayer: eui.UILayer;
        popupLayer: eui.UILayer;
    }

    export var editorui: EditorUI = <any>{};
}