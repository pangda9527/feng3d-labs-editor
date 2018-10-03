namespace editor
{
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
	/**
	 * editor.editorui.maskLayer.addChild(new editor.ColorPickerView())
	 * 
	 */
    export class ColorPickerView extends eui.Component
    {
        public group0: eui.Group;
        public image0: eui.Image;
        public pos0: eui.Group;
        public group1: eui.Group;
        public image1: eui.Image;
        public pos1: eui.Group;
        public txtR: eui.TextInput;
        public txtG: eui.TextInput;
        public txtB: eui.TextInput;
        public txtColor: eui.TextInput;


        //
        @feng3d.watch("onColorChanged")
        color = new feng3d.Color3(0.2, 0.5, 0);

        public constructor()
        {
            super();
            this.skinName = "ColorPickerView";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            var w = this.group1.width - 4;
            var h = this.group1.height - 4;
            var imagedata1 = feng3d.imageUtil.createColorPickerStripe(w, h, colors, null, false);
            feng3d.dataTransform.imageDataToDataURL(imagedata1, dataurl =>
            {
                this.image1.source = dataurl;
            });
            this.updateView();

            //
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        $onRemoveFromStage()
        {
            //
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);

            super.$onRemoveFromStage()
        }

        private _textfocusintxt: eui.TextInput;
        protected ontxtfocusin(e: egret.Event)
        {
            this._textfocusintxt = e.currentTarget;
        }

        protected ontxtfocusout(e: egret.Event)
        {
            this._textfocusintxt = null;
        }

        private onTextChange(e: egret.Event)
        {
            if (this._textfocusintxt == e.currentTarget)
            {
                var color = this.color.clone();
                switch (this._textfocusintxt)
                {
                    case this.txtR:
                        color.r = (Number(this.txtR.text) || 0) / 255;
                        break;
                    case this.txtG:
                        color.g = (Number(this.txtG.text) || 0) / 255;
                        break;
                    case this.txtB:
                        color.b = (Number(this.txtB.text) || 0) / 255;
                        break;
                    case this.txtColor:
                        color.fromUnit(Number("0x" + this.txtColor.text) || 0);
                        break;
                }
                this.color = color;
            }
        }

        private onColorChanged()
        {
            if (this.stage) this.updateView();
        }

        private basecolor: feng3d.Color3;
        private updateView()
        {
            if (this._textfocusintxt != this.txtR) this.txtR.text = Math.round(this.color.r * 255).toString();
            if (this._textfocusintxt != this.txtG) this.txtG.text = Math.round(this.color.g * 255).toString();
            if (this._textfocusintxt != this.txtB) this.txtB.text = Math.round(this.color.b * 255).toString();
            if (this._textfocusintxt != this.txtColor) this.txtColor.text = this.color.toHexString().substr(1);

            //
            var result = feng3d.imageUtil.getColorPickerRectPosition(this.color.toInt());
            var ratio = feng3d.imageUtil.getMixColorRatio(result.color.toInt(), colors);
            this.basecolor = result.color;

            //
            var imagedata = feng3d.imageUtil.createColorPickerRect(this.basecolor.toInt(), this.group0.width, this.group0.height);
            feng3d.dataTransform.imageDataToDataURL(imagedata, dataurl =>
            {
                this.image0.source = dataurl;
            });

            //
            this.pos0.x = result.ratioW * (this.group0.width - this.pos0.width);
            this.pos0.y = result.ratioH * (this.group0.height - this.pos0.height);

            this.pos1.y = ratio * (this.group0.height - this.pos0.height);
        }
    }
}