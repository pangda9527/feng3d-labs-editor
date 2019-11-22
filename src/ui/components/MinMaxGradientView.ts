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

            this.colorGroup0.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.colorGroup0.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.removeEventListener(egret.Event.RESIZE, this.onReSize, this);

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            this.colorGroup0.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);

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
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(color).toDataURL();
                    //
                    if (this.secondGroup.parent) this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Gradient)
                {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent) this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.TwoColors)
                {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(this.minMaxGradient.colorMin).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawColorRect(this.minMaxGradient.colorMax).toDataURL();
                    //
                    if (!this.secondGroup.parent) this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.TwoGradients)
                {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradientMin).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawMinMaxGradient(this.minMaxGradient.gradientMax).toDataURL();
                    //
                    if (!this.secondGroup.parent) this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomColor)
                {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
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
            var view: eui.Component = null;
            switch (e.currentTarget)
            {
                case this.colorGroup0:
                    this.activeColorGroup = this.colorGroup0;
                    switch (this.minMaxGradient.mode)
                    {
                        case feng3d.MinMaxGradientMode.Color:
                            view = colorPickerView = colorPickerView || new editor.ColorPickerView();
                            colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.Gradient:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.TwoColors:
                            view = colorPickerView = colorPickerView || new editor.ColorPickerView();
                            colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.TwoGradients:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.RandomColor:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                    }
                    break;
                case this.colorGroup1:
                    this.activeColorGroup = this.colorGroup1;
                    switch (this.minMaxGradient.mode)
                    {
                        case feng3d.MinMaxGradientMode.TwoColors:
                            view = colorPickerView = colorPickerView || new editor.ColorPickerView();
                            colorPickerView.color = this.minMaxGradient.colorMax;
                            break;
                        case feng3d.MinMaxGradientMode.TwoGradients:
                            view = gradientEditor = gradientEditor || new editor.GradientEditor();
                            gradientEditor.gradient = this.minMaxGradient.gradientMax;
                            break;
                    }
                    break;
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, (v) =>
                    {
                        this.minMaxGradient.mode = v;
                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    });
                    break;
            }
            if (view)
            {
                var pos = this.localToGlobal(0, 0);
                pos.x = pos.x - 318;
                view.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                //
                popupview.popupView(view, {
                    x: pos.x, y: pos.y, closecallback: () =>
                    {
                        view.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                        this.activeColorGroup = null;
                    },
                });
            }
        }

        private onPickerViewChanged()
        {
            if (this.activeColorGroup == this.colorGroup0)
            {
                switch (this.minMaxGradient.mode)
                {
                    case feng3d.MinMaxGradientMode.Color:
                        this.minMaxGradient.color = (<feng3d.Color4>colorPickerView.color).clone();
                        break;
                    case feng3d.MinMaxGradientMode.Gradient:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.TwoColors:
                        this.minMaxGradient.color = (<feng3d.Color4>colorPickerView.color).clone();
                        break;
                    case feng3d.MinMaxGradientMode.TwoGradients:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomColor:
                        this.minMaxGradient.gradient = gradientEditor.gradient;
                        break;
                }
            } else if (this.activeColorGroup == this.colorGroup1)
            {
                switch (this.minMaxGradient.mode)
                {
                    case feng3d.MinMaxGradientMode.TwoColors:
                        this.minMaxGradient.colorMax = (<feng3d.Color4>colorPickerView.color).clone();
                        break;
                    case feng3d.MinMaxGradientMode.TwoGradients:
                        this.minMaxGradient.gradientMax = gradientEditor.gradient;
                        break;
                }
            }

            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

        private _onRightClick(e: egret.MouseEvent)
        {
            var mode = this.minMaxGradient.mode;
            var target = e.currentTarget;

            var menus: MenuItem[] = [{
                label: "Copy", click: () =>
                {
                    if (target == this.colorGroup0)
                    {
                        if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.TwoColors)
                            copyColor = this.minMaxGradient.color.clone();
                        else
                            copyGradient = feng3d.serialization.clone(this.minMaxGradient.gradient);
                    } else if (target == this.colorGroup1)
                    {
                        if (mode == feng3d.MinMaxGradientMode.TwoColors)
                            copyColor = this.minMaxGradient.colorMax.clone();
                        else
                            copyGradient = feng3d.serialization.clone(this.minMaxGradient.gradientMax);
                    }
                }
            }];
            if ((copyGradient != null && (mode == feng3d.MinMaxGradientMode.Gradient || mode == feng3d.MinMaxGradientMode.TwoGradients || mode == feng3d.MinMaxGradientMode.RandomColor))
                || (copyColor != null && (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.TwoColors))
            )
            {
                menus.push({
                    label: "Paste", click: () =>
                    {
                        if (target == this.colorGroup0)
                        {
                            if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.TwoColors)
                                this.minMaxGradient.color.copy(copyColor);
                            else
                                feng3d.serialization.setValue(this.minMaxGradient.gradient, copyGradient);
                        } else if (target == this.colorGroup1)
                        {
                            if (mode == feng3d.MinMaxGradientMode.TwoColors)
                                this.minMaxGradient.colorMax.copy(copyColor);
                            else
                                feng3d.serialization.setValue(this.minMaxGradient.gradientMax, copyGradient);
                        }

                        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            menu.popup(menus)
        }

    }

    var copyGradient: feng3d.Gradient;
    var copyColor: feng3d.Color4;

}