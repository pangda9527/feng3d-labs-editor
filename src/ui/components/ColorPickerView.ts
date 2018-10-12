namespace editor
{
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
	/**
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
        public groupA: eui.Group;
        public txtA: eui.TextInput;
        public txtColor: eui.TextInput;

        //
        @feng3d.watch("onColorChanged")
        color: feng3d.Color3 | feng3d.Color4 = new feng3d.Color4(0.2, 0.5, 0);

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
            this.image1.source = feng3d.dataTransform.imageDataToDataURL(imagedata1);
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
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
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
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            //
            super.$onRemoveFromStage()
        }

        private _mouseDownGroup: eui.Group;
        private onMouseDown(e: egret.Event)
        {
            this._mouseDownGroup = e.currentTarget;

            this.onMouseMove();

            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        }

        private onMouseMove()
        {
            var image = this.image0;
            if (this._mouseDownGroup == this.group0) image = this.image0;
            else image = this.image1;

            var p = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var start = image.localToGlobal(0, 0);
            var end = image.localToGlobal(image.width, image.height);

            var rw = feng3d.FMath.clamp((p.x - start.x) / (end.x - start.x), 0, 1);
            var rh = feng3d.FMath.clamp((p.y - start.y) / (end.y - start.y), 0, 1);

            if (this.group0 == this._mouseDownGroup)
            {
                this.rw = rw;
                this.rh = rh;
                var color = feng3d.imageUtil.getColorPickerRectAtPosition(this.basecolor.toInt(), rw, rh);
            } else if (this.group1 == this._mouseDownGroup)
            {
                this.ratio = rh;
                var basecolor = this.basecolor = feng3d.imageUtil.getMixColorAtRatio(rh, colors);
                var color = feng3d.imageUtil.getColorPickerRectAtPosition(basecolor.toInt(), this.rw, this.rh);
            }
            if (this.color instanceof feng3d.Color3)
            {
                this.color = color;
            }
            else
            {
                this.color = new feng3d.Color4(color.r, color.g, color.b, this.color.a);
            }
        }

        private onMouseUp()
        {
            this._mouseDownGroup = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        }

        private _textfocusintxt: eui.TextInput;
        protected ontxtfocusin(e: egret.Event)
        {
            this._textfocusintxt = e.currentTarget;
        }

        protected ontxtfocusout(e: egret.Event)
        {
            this._textfocusintxt = null;
            this.updateView();
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
                    case this.txtA:
                        (<feng3d.Color4>color).a = (Number(this.txtA.text) || 0) / 255;
                        break;
                    case this.txtColor:
                        color.fromUnit(Number("0x" + this.txtColor.text) || 0);
                        break;
                }
                this.color = color;
            }
        }

        private onColorChanged(property, oldValue: feng3d.Color4 | feng3d.Color4, newValue: feng3d.Color4 | feng3d.Color4)
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);

            if (oldValue && newValue && !oldValue.equals(newValue))
            {
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }

        private basecolor: feng3d.Color3;
        private rw: number;
        private rh: number;
        private ratio: number;
        private updateView()
        {
            if (this._textfocusintxt != this.txtR) this.txtR.text = Math.round(this.color.r * 255).toString();
            if (this._textfocusintxt != this.txtG) this.txtG.text = Math.round(this.color.g * 255).toString();
            if (this._textfocusintxt != this.txtB) this.txtB.text = Math.round(this.color.b * 255).toString();
            if (this._textfocusintxt != this.txtA) this.txtA.text = Math.round((<feng3d.Color4>this.color).a * 255).toString();
            if (this._textfocusintxt != this.txtColor) this.txtColor.text = this.color.toHexString().substr(1);

            if (this._mouseDownGroup == null)
            {
                //
                var result = feng3d.imageUtil.getColorPickerRectPosition(this.color.toInt());
                this.basecolor = result.color;
                this.rw = result.ratioW;
                this.rh = result.ratioH;
                this.ratio = feng3d.imageUtil.getMixColorRatio(this.basecolor.toInt(), colors);
            }
            if (this._mouseDownGroup != this.group0)
            {
                //
                var imagedata = feng3d.imageUtil.createColorPickerRect(this.basecolor.toInt(), this.group0.width - 16, this.group0.height - 16);
                this.image0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            }

            this.pos1.y = this.ratio * (this.group1.height - this.pos1.height);
            //
            this.pos0.x = this.rw * (this.group0.width - this.pos0.width);
            this.pos0.y = this.rh * (this.group0.height - this.pos0.height);

            //
            if (this.color instanceof feng3d.Color3)
            {
                this._groupAParent = this._groupAParent || this.groupA.parent;
                this.groupA.parent && this.groupA.parent.removeChild(this.groupA);
            } else
            {
                if (this.groupA.parent == null && this._groupAParent)
                {
                    this._groupAParent.addChildAt(this.groupA, 3);
                }
            }
        }

        private _groupAParent: egret.DisplayObjectContainer;
    }
    export var colorPickerView: ColorPickerView;
}