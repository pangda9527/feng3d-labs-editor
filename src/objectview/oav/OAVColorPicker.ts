namespace feng3d.editor
{
    @OAVComponent()
    export class OAVColorPicker extends OAVBase
    {
        public label: eui.Label;
        public colorPicker: feng3d.editor.ColorPicker;
        public input: eui.TextInput;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "OAVColorPicker";
        }

        protected onComplete(): void
        {
            super.onComplete();
            this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.updateView();
        }

        updateView()
        {
            this.colorPicker.value = this.attributeValue;
            this.input.text = this.colorPicker.value.toHexString();
        }

        protected onChange(event: egret.Event)
        {
            this.attributeValue = this.colorPicker.value;
            this.input.text = this.colorPicker.value.toHexString();
        }

        private _textfocusintxt: boolean;
        private ontxtfocusin()
        {
            this._textfocusintxt = true;
        }

        private ontxtfocusout()
        {
            this._textfocusintxt = false;
            this.input.text = this.colorPicker.value.toHexString();
        }

        private onTextChange()
        {
            if (this._textfocusintxt)
            {
                var text = this.input.text;
                this.colorPicker.value = this.attributeValue = new Color3().fromUnit(Number("0x" + text.substr(1)));
            }
        }
    }
}