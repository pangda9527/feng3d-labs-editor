declare namespace editor {
    class ColorPicker extends eui.Component implements eui.UIComponent {
        picker: eui.Rect;
        value: feng3d.Color4 | feng3d.Color3;
        private _value;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onClick;
        private onPickerViewChanged;
    }
}
//# sourceMappingURL=ColorPicker.d.ts.map