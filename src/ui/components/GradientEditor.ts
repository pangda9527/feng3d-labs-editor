namespace editor
{
    export class GradientEditor extends eui.Component
    {
        @feng3d.watch("_onGradientChanged")
        gradient = new feng3d.Gradient();

        public modeCB: ComboBox;
        public controllerGroup: eui.Group;
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

            this.alphaLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);

            this.colorPicker.addEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        }

        $onRemoveFromStage()
        {
            this.alphaLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);

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
            var alphaKeys = this.gradient.alphaKeys;
            for (let i = 0, n = alphaKeys.length; i < n; i++)
            {
                const element = alphaKeys[i];
                this._drawAlphaGraphics(this._alphaSprite.graphics, element.time, element.alpha, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == alphaKeys[i]);
            }
            var colorKeys = this.gradient.colorKeys;
            for (let i = 0, n = colorKeys.length; i < n; i++)
            {
                const element = colorKeys[i];
                this._drawColorGraphics(this._colorSprite.graphics, element.time, element.color, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == colorKeys[i]);
            }
            //
            this._parentGroup = this._parentGroup || this.colorGroup.parent;

            //
            if (this._alphaNumberSliderTextInputBinder)
            {
                this._alphaNumberSliderTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._alphaNumberSliderTextInputBinder.dispose();
            }
            //
            if (this._loactionNumberTextInputBinder)
            {
                this._loactionNumberTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._loactionNumberTextInputBinder.dispose();
            }
            this.controllerGroup.visible = !!this._selectedValue;
            if (this._selectedValue)
            {
                if (this._selectedValue.color)
                {
                    this.alphaGroup.parent && this.alphaGroup.parent.removeChild(this.alphaGroup);
                    this.colorGroup.parent || this._parentGroup.addChildAt(this.colorGroup, 0);
                    //
                    this.colorPicker.value = this._selectedValue.color;
                } else
                {
                    this.colorGroup.parent && this.colorGroup.parent.removeChild(this.colorGroup);
                    this.alphaGroup.parent || this._parentGroup.addChildAt(this.alphaGroup, 0);
                    this._alphaNumberSliderTextInputBinder = new NumberSliderTextInputBinder().init({
                        space: this._selectedValue, attribute: "alpha",
                        slider: this.alphaSlide,
                        textInput: this.alphaInput, controller: this.alphaLabel, minValue: 0, maxValue: 1,
                    });
                    this._alphaNumberSliderTextInputBinder.on("valueChanged", this._onAlphaChanged, this);
                }
                this._loactionNumberTextInputBinder = new NumberTextInputBinder().init({
                    space: this._selectedValue, attribute: "time",
                    textInput: this.locationInput, controller: this.locationLabel, minValue: 0, maxValue: 1,
                });
                this._loactionNumberTextInputBinder.on("valueChanged", this._onLocationChanged, this);
            }
        }

        private _alphaSprite: egret.Sprite;
        private _colorSprite: egret.Sprite;
        private _parentGroup: egret.DisplayObjectContainer;
        private _loactionNumberTextInputBinder: NumberTextInputBinder;
        private _alphaNumberSliderTextInputBinder: NumberSliderTextInputBinder;
        private _selectedValue: { time: number, alpha?: number, color?: feng3d.Color3 };

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
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }
        private _onLocationChanged()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
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
            if (this._selectedValue && this._selectedValue.color)
            {
                this._selectedValue.color = new feng3d.Color3(this.colorPicker.value.r, this.colorPicker.value.g, this.colorPicker.value.b);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        }

        private _onGradientChanged()
        {
            this._selectedValue = this.gradient.colorKeys[0];

            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onMouseDownLineGroup: egret.DisplayObject;
        private _removedTemp: boolean;
        private _onMouseDown(e: egret.MouseEvent)
        {
            this._onMouseDownLineGroup = e.currentTarget;
            var sp = (<egret.DisplayObject>e.currentTarget).localToGlobal(0, 0);
            var localPosX = feng3d.windowEventProxy.clientX - sp.x;
            var time = localPosX / (<egret.DisplayObject>e.currentTarget).width;
            var newAlphaKey = { time: time, alpha: this.gradient.getAlpha(time) };
            var newColorKey = { time: time, color: this.gradient.getColor(time) };

            switch (e.currentTarget)
            {
                case this.alphaLineGroup:
                    this._selectedValue = null;
                    var onClickIndex = -1;
                    var alphaKeys = this.gradient.alphaKeys;
                    for (let i = 0, n = alphaKeys.length; i < n; i++)
                    {
                        const element = alphaKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8)
                        {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1)
                    {
                        this._selectedValue = alphaKeys[onClickIndex];
                    } else if (alphaKeys.length < 8)
                    {
                        this._selectedValue = newAlphaKey;
                        alphaKeys.push(newAlphaKey);
                        this.gradient.updateAlphaKeys();
                    }
                    break
                case this.colorLineGroup:
                    var onClickIndex = -1;
                    var colorKeys = this.gradient.colorKeys;
                    for (let i = 0, n = colorKeys.length; i < n; i++)
                    {
                        const element = colorKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8)
                        {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1)
                    {
                        this._selectedValue = colorKeys[onClickIndex];
                    } else if (colorKeys.length < 8)
                    {
                        this._selectedValue = newColorKey;
                        colorKeys.push(newColorKey);
                        this.gradient.updateColorKeys();
                    }
                    break
            }
            if (this._selectedValue)
            {
                //
                this.updateView();
                feng3d.windowEventProxy.on("mousemove", this._onAlphaColorMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this._onAlphaColorMouseUp, this);
                this._removedTemp = false;
            }
        }

        private _onAlphaColorMouseMove()
        {
            if (!this._selectedValue) return;

            var sp = this._onMouseDownLineGroup.localToGlobal(0, 0);
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rect = new feng3d.Rectangle(sp.x, sp.y, this._onMouseDownLineGroup.width, this._onMouseDownLineGroup.height);
            rect.inflate(8, 8);
            if (rect.containsPoint(mousePos))
            {
                if (this._removedTemp)
                {
                    if (this._selectedValue.color)
                    {
                        var index = this.gradient.colorKeys.indexOf(<any>this._selectedValue);
                        if (index == -1) this.gradient.colorKeys.push(<any>this._selectedValue);
                        this.gradient.updateColorKeys();
                    } else
                    {
                        var index = this.gradient.alphaKeys.indexOf(<any>this._selectedValue);
                        if (index == -1) this.gradient.alphaKeys.push(<any>this._selectedValue);
                        this.gradient.updateAlphaKeys();
                    }
                    this._removedTemp = false;
                }
            } else
            {
                if (!this._removedTemp)
                {
                    if (this._selectedValue.color)
                    {
                        var index = this.gradient.colorKeys.indexOf(<any>this._selectedValue);
                        if (index != -1) this.gradient.colorKeys.splice(index, 1);
                        this.gradient.updateColorKeys();
                    } else
                    {
                        var index = this.gradient.alphaKeys.indexOf(<any>this._selectedValue);
                        if (index != -1) this.gradient.alphaKeys.splice(index, 1);
                        this.gradient.updateAlphaKeys();
                    }
                    this._removedTemp = true;
                }
            }
            if (this._selectedValue.color)
            {
                var sp = this.colorLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.colorLineGroup.width;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            } else
            {
                var sp = this.alphaLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.alphaLineGroup.width;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private _onAlphaColorMouseUp()
        {
            if (this._removedTemp)
            {
                this._selectedValue = null;
            }
            this._onMouseDownLineGroup = null;
            feng3d.windowEventProxy.off("mousemove", this._onAlphaColorMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this._onAlphaColorMouseUp, this);
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }
    }
    export var gradientEditor: GradientEditor;
}