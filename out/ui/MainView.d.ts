declare namespace feng3d.editor {
    class MainView extends eui.Component implements eui.UIComponent {
        mainGroup: eui.Group;
        topGroup: eui.Group;
        mainButton: eui.Button;
        moveButton: eui.ToggleButton;
        rotateButton: eui.ToggleButton;
        scaleButton: eui.ToggleButton;
        helpButton: eui.Button;
        settingButton: eui.Button;
        hierachyGroup: eui.Group;
        assetsGroup: eui.Group;
        private watchers;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onMainButtonClick();
        private onMainMenu(item);
        private onHelpButtonClick();
        private onButtonClick(event);
        private onObject3DOperationIDChange();
    }
    var createObject3DView: CreateObject3DView;
}
