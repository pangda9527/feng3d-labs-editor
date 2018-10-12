namespace editor
{
    /**
     * 最大最小颜色渐变界面
     */
    export class MinMaxGradientView extends eui.Component
    {
        //
        @feng3d.watch("_onMinMaxGradientChanged")
        minMaxGradient = new feng3d.MinMaxGradient();

        public colorGroup0: eui.Group;
        public colorImage0: eui.Image;
        public secondGroup: eui.Group;
        public colorGroup1: eui.Group;
        public colorImage1: eui.Image;
        public modeBtn: eui.Button;

        private secondGroupParent: egret.DisplayObjectContainer;

        public constructor()
        {
            super();
            this.skinName = "MinMaxGradientView";
            this.x = 100;
            this.y = 100;
            this.width = 100;
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.secondGroupParent = this.secondGroupParent || this.secondGroup.parent;

            this.colorGroup0.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.addEventListener(egret.Event.RESIZE, this.onReSize, this);

            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.colorGroup0.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.removeEventListener(egret.Event.RESIZE, this.onReSize, this);

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            //
            if (this.colorGroup0.width > 0 && this.colorGroup0.height > 0)
            {
                if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color)
                {
                    var color = this.minMaxGradient.getValue(0);
                    var imagedata = feng3d.imageUtil.createColorRect(color, this.colorGroup0.width, this.colorGroup0.height);
                    this.colorImage0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    if (this.secondGroup.parent) this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Gradient)
                {
                    var imagedata = feng3d.imageUtil.createMinMaxGradientRect(this.minMaxGradient.minMaxGradient, this.colorGroup0.width, this.colorGroup0.height);
                    this.colorImage0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    if (this.secondGroup.parent) this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                {
                    var randomBetweenTwoColors = <feng3d.RandomBetweenTwoColors>this.minMaxGradient.minMaxGradient
                    var imagedata = feng3d.imageUtil.createColorRect(randomBetweenTwoColors.colorMin, this.colorGroup0.width, this.colorGroup0.height);
                    this.colorImage0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    var imagedata = feng3d.imageUtil.createColorRect(randomBetweenTwoColors.colorMax, this.colorGroup1.width, this.colorGroup1.height);
                    this.colorImage1.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    if (!this.secondGroup.parent) this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoGradients)
                {
                    var randomBetweenTwoGradients = <feng3d.RandomBetweenTwoGradients>this.minMaxGradient.minMaxGradient
                    var imagedata = feng3d.imageUtil.createMinMaxGradientRect(randomBetweenTwoGradients.gradientMin, this.colorGroup0.width, this.colorGroup0.height);
                    this.colorImage0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    var imagedata = feng3d.imageUtil.createMinMaxGradientRect(randomBetweenTwoGradients.gradientMax, this.colorGroup1.width, this.colorGroup1.height);
                    this.colorImage1.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    if (!this.secondGroup.parent) this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomColor)
                {
                    var imagedata = feng3d.imageUtil.createMinMaxGradientRect((<feng3d.MinMaxGradientRandomColor>this.minMaxGradient.minMaxGradient).gradient, this.colorGroup0.width, this.colorGroup0.height);
                    this.colorImage0.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
                    //
                    if (this.secondGroup.parent) this.secondGroup.parent.removeChild(this.secondGroup);
                }

            }

        }

        private onReSize()
        {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        }

        private _onMinMaxGradientChanged()
        {
            if (this.stage) this.updateView();
        }

        private activeColorGroup: any;
        private onClick(e: egret.MouseEvent)
        {
            switch (e.currentTarget)
            {
                case this.colorGroup0:
                    if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color || this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                    {
                        if (!colorPickerView) colorPickerView = new editor.ColorPickerView();
                        colorPickerView.color = this.minMaxGradient.getValue(0);
                        var pos = this.localToGlobal(0, 0);
                        // pos.x = pos.x - colorPickerView.width;
                        pos.x = pos.x - 318;
                        colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        this.activeColorGroup = this.colorGroup0;
                        //
                        popupview.popupView(colorPickerView, () =>
                        {
                            colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                            this.activeColorGroup = null;
                        }, pos.x, pos.y);
                    }
                    break;
                case this.colorGroup1:
                    if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                    {
                        if (!colorPickerView) colorPickerView = new editor.ColorPickerView();
                        colorPickerView.color = this.minMaxGradient.getValue(0);
                        var pos = this.localToGlobal(0, 0);
                        // pos.x = pos.x - colorPickerView.width;
                        pos.x = pos.x - 318;
                        colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        this.activeColorGroup = this.colorGroup1;
                        //
                        popupview.popupView(colorPickerView, () =>
                        {
                            colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                            this.activeColorGroup = null;
                        }, pos.x, pos.y);
                    }
                    break;
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, (v) =>
                    {
                        this.minMaxGradient.mode = v;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    }, { width: 210 });
                    break;
            }
        }

        private onPickerViewChanged()
        {
            if (this.activeColorGroup == this.colorGroup0)
            {
                if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color)
                {
                    (<feng3d.MinMaxGradientColor>this.minMaxGradient.minMaxGradient).color = <feng3d.Color4>colorPickerView.color;
                } else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                {
                    (<feng3d.RandomBetweenTwoColors>this.minMaxGradient.minMaxGradient).colorMin = <feng3d.Color4>colorPickerView.color;
                }
            } else
            {
                (<feng3d.RandomBetweenTwoColors>this.minMaxGradient.minMaxGradient).colorMax = <feng3d.Color4>colorPickerView.color;
            }

            this.updateView();
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

    }
}