namespace feng3d.editor
{
    @OAVComponent()
    export class OAVColorPicker extends OAVBase
    {
        public label: eui.Label;
        public colorPicker: feng3d.editor.ColorPicker;
        public input: eui.TextInput;

        attributeValue: Color3 | Color4;

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
            var color = this.attributeValue;
            if (color instanceof Color3)
            {
                this.colorPicker.value = color;
            } else
            {
                this.colorPicker.value = color.toColor3();
            }
            this.input.text = color.toHexString();
        }

        protected onChange(event: egret.Event)
        {
            var color = this.attributeValue;
            var pickerValue = this.colorPicker.value;
            color.r = pickerValue.r;
            color.g = pickerValue.g;
            color.b = pickerValue.b;
            //
            this.attributeValue = color;
            this.input.text = color.toHexString();
        }

        private _textfocusintxt: boolean;
        private ontxtfocusin()
        {
            this._textfocusintxt = true;
        }

        private ontxtfocusout()
        {
            this._textfocusintxt = false;
            this.input.text = this.attributeValue.toHexString();
        }

        private onTextChange()
        {
            if (this._textfocusintxt)
            {
                var text = this.input.text;
                var color = this.attributeValue;
                color.fromUnit(Number("0x" + text.substr(1)));
                this.attributeValue = color;

                if (color instanceof Color3)
                {
                    this.colorPicker.value = color;
                } else
                {
                    this.colorPicker.value = color.toColor3();
                }
            }
        }
    }
}