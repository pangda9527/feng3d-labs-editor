namespace editor
{
    @feng3d.OAVComponent()
    export class OAVColorPicker extends OAVBase
    {
        public labelLab: eui.Label;
        public colorPicker: editor.ColorPicker;
        public input: eui.TextInput;

        attributeValue: feng3d.Color3 | feng3d.Color4;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVColorPicker";
        }

        initView()
        {
            this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        dispose()
        {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        updateView()
        {
            var color = this.attributeValue;
            if (color instanceof feng3d.Color3)
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

                if (color instanceof feng3d.Color3)
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