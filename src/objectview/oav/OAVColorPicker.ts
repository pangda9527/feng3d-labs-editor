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
            if (this._attributeViewInfo.editable)
            {
                this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.colorPicker.touchEnabled = this.colorPicker.touchChildren = this.input.enabled = this._attributeViewInfo.editable;
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
            this.colorPicker.value = color;
            this.input.text = color.toHexString();
        }

        protected onChange(event: egret.Event)
        {
            //
            this.attributeValue = this.colorPicker.value.clone();
            this.input.text = this.attributeValue.toHexString();
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
                if (this.attributeValue instanceof feng3d.Color3)
                {
                    this.colorPicker.value = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                } else
                {
                    this.colorPicker.value = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                }
            }
        }
    }
}