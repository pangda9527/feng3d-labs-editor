namespace editor
{
    export class GradientEditor extends eui.Component
    {
        @feng3d.watch("_onGradientChanged")
        gradient = new feng3d.Gradient();

        public modeCB: ComboBox;
        public alphaLineGroup: eui.Group;
        public colorImage: eui.Image;
        public colorLineGroup: eui.Group;
        public colorGroup: eui.Group;
        public colorPicker: editor.ColorPicker;
        public alphaGroup: eui.Group;
        public alphaLabel: eui.Label;
        public alphaSlide: eui.HSlider;
        public alphaInput: eui.TextInput;
        public locationLabel: eui.Label;
        public locationInput: eui.TextInput;


        public constructor()
        {
            super();
            this.skinName = "GradientEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.updateView();

            this.colorPicker.addEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }

        $onRemoveFromStage()
        {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.removeEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

            var list = [];
            for (const key in feng3d.GradientMode)
            {
                if (isNaN(Number(key)))
                    list.push({ label: key, value: feng3d.GradientMode[key] });
            }
            this.modeCB.dataProvider = list;
            this.modeCB.data = list.filter(v => v.value == this.gradient.mode)[0];
            //
            if (this.colorImage.width > 0 && this.colorImage.height > 0)
            {
                var imagedata = feng3d.imageUtil.createMinMaxGradientRect(this.gradient, this.colorImage.width, this.colorImage.height);
                this.colorImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
            }
            if (!this._alphaSprite)
            {
                this.alphaLineGroup.addChild(this._alphaSprite = new egret.Sprite());
            }
            this._alphaSprite.graphics.clear();
            if (!this._colorSprite)
            {
                this.colorLineGroup.addChild(this._colorSprite = new egret.Sprite());
            }
            this._colorSprite.graphics.clear();
            //
            if (this.gradient.alphaKeys.length == 0) this.gradient.alphaKeys = this.gradient.getRealAlphaKeys();
            var alphaKeys = this.gradient.alphaKeys;
            for (let i = 0, n = alphaKeys.length; i < n; i++)
            {
                const element = alphaKeys[i];
                this._drawAlphaGraphics(this._alphaSprite.graphics, element.time, element.alpha, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectAlpha && i == this._selectIndex);
            }
            if (this.gradient.colorKeys.length == 0) this.gradient.colorKeys = this.gradient.getRealColorKeys();
            var colorKeys = this.gradient.colorKeys;
            for (let i = 0, n = colorKeys.length; i < n; i++)
            {
                const element = colorKeys[i];
                this._drawColorGraphics(this._colorSprite.graphics, element.time, element.color, this.alphaLineGroup.width, this.alphaLineGroup.height, !this._selectAlpha && i == this._selectIndex);
            }
            //
            this._parentGroup = this._parentGroup || this.colorGroup.parent;
            if (this._selectAlpha)
            {
                this._selectedAlphaKey = alphaKeys[this._selectIndex];
                this.colorGroup.parent && this.colorGroup.parent.removeChild(this.colorGroup);
                this.alphaGroup.parent || this._parentGroup.addChild(this.alphaGroup);
                //
                if (this._alphaNumberSliderTextInputBinder)
                {
                    this._alphaNumberSliderTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                    this._alphaNumberSliderTextInputBinder.dispose();
                }
                this._alphaNumberSliderTextInputBinder = new NumberSliderTextInputBinder().init({
                    space: this._selectedAlphaKey, attribute: "alpha",
                    slider: this.alphaSlide,
                    textInput: this.alphaInput, controller: this.alphaLabel, minValue: 0, maxValue: 1,
                });
                this._alphaNumberSliderTextInputBinder.on("valueChanged", this._onAlphaChanged, this);
            } else
            {
                this._selectedColorKey = colorKeys[this._selectIndex];
                this.alphaGroup.parent && this.alphaGroup.parent.removeChild(this.alphaGroup);
                this.colorGroup.parent || this.colorGroup.addChild(this.colorGroup);
                //
                this.colorPicker.value = this._selectedColorKey.color;
            }
            //
            if (this._loactionNumberTextInputBinder)
            {
                this._loactionNumberTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._loactionNumberTextInputBinder.dispose();
            }
            this._loactionNumberTextInputBinder = new NumberTextInputBinder().init({
                space: this._selectedAlphaKey || this._selectedColorKey, attribute: "time",
                textInput: this.locationInput, controller: this.locationLabel, minValue: 0, maxValue: 1,
            });
            this._loactionNumberTextInputBinder.on("valueChanged", this._onLocationChanged, this);
        }

        private _alphaSprite: egret.Sprite;
        private _colorSprite: egret.Sprite;
        private _selectAlpha = false;
        private _selectIndex = 0;
        private _parentGroup: egret.DisplayObjectContainer;
        private _selectedAlphaKey: { alpha: number, time: number };
        private _selectedColorKey: { color: feng3d.Color3, time: number };
        private _loactionNumberTextInputBinder: NumberTextInputBinder;
        private _alphaNumberSliderTextInputBinder: NumberSliderTextInputBinder;

        private _drawAlphaGraphics(graphics: egret.Graphics, time: number, alpha: number, width: number, height: number, selected: boolean)
        {
            graphics.beginFill(0xffffff, alpha);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060)
            graphics.moveTo(time * width, height);
            graphics.lineTo(time * width - 5, height - 10);
            graphics.lineTo(time * width - 5, height - 15);
            graphics.lineTo(time * width + 5, height - 15);
            graphics.lineTo(time * width + 5, height - 10);
            graphics.lineTo(time * width, height);
            graphics.endFill();
        }

        private _drawColorGraphics(graphics: egret.Graphics, time: number, color: feng3d.Color3, width: number, height: number, selected: boolean)
        {
            graphics.beginFill(color.toInt(), 1);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060)
            graphics.moveTo(time * width, 0);
            graphics.lineTo(time * width - 5, 10);
            graphics.lineTo(time * width - 5, 15);
            graphics.lineTo(time * width + 5, 15);
            graphics.lineTo(time * width + 5, 10);
            graphics.lineTo(time * width, 0);
            graphics.endFill();
        }

        private _onAlphaChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
        private _onLocationChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onModeCBChange()
        {
            this.gradient.mode = this.modeCB.data.value;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private _onColorPickerChange()
        {
            if (this._selectedColorKey)
            {
                this._selectedColorKey.color = new feng3d.Color3(this.colorPicker.value.r, this.colorPicker.value.g, this.colorPicker.value.b);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onGradientChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
    export var gradientEditor: GradientEditor;
}