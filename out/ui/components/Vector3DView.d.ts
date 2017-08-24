declare namespace feng3d.editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        vm: Vector3D;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onTextChange(event);
    }
}
