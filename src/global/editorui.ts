namespace editor
{
    export interface EditorUI
    {
        stage: egret.Stage;
        assetview: ProjectView;
        mainview: MainView;
        tooltipLayer: eui.UILayer;
        popupLayer: eui.UILayer;

        messageLayer: eui.UILayer;
    }

    export var editorui: EditorUI = <any>{};
}