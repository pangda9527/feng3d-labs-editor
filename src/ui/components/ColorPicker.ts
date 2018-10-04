namespace editor
{
    export class ColorPicker extends eui.Component implements eui.UIComponent
    {
        public picker: eui.Rect;

        get value()
        {
            if (this.picker)
                this._value.fromUnit(this.picker.fillColor);
            return this._value;
        }
        set value(v)
        {
            this._value.fromUnit(v.toInt());
            if (this.picker)
                this.picker.fillColor = this._value.toInt();
        }
        private _value = new feng3d.Color3();

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ColorPicker";
        }

        private onComplete()
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
            this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        private onRemovedFromStage()
        {
            this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        }

        private onClick()
        {
            if (!colorPickerView) colorPickerView = new editor.ColorPickerView();
            colorPickerView.color = this.value;
            var pos = this.localToGlobal(0, 0);
            // pos.x = pos.x - colorPickerView.width;
            pos.x = pos.x - 318;
            colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            //
            popupview.popupView(colorPickerView, () =>
            {
                colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            }, pos.x, pos.y);
        }

        private onPickerViewChanged()
        {
            this.value = colorPickerView.color;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
    }
    var colorPickerView: ColorPickerView;
}