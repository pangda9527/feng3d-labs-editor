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

        public colorGroup:eui.Group;
        public colorImage:eui.Image;
        public modeBtn:eui.Button;

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

            this.colorGroup.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup.addEventListener(egret.Event.RESIZE, this.onReSize, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.colorGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup.removeEventListener(egret.Event.RESIZE, this.onReSize, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            var color = this.minMaxGradient.getValue(0);

            //
            if (this.colorGroup.width > 0 && this.colorGroup.height > 0)
            {
                var imagedata = feng3d.imageUtil.createColorRect(color, this.colorGroup.width, this.colorGroup.height);
                this.colorImage.source = feng3d.dataTransform.imageDataToDataURL(imagedata);
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

        private onClick(e: egret.MouseEvent)
        {
            switch (e.currentTarget)
            {
                case this.colorGroup:
                    if (!colorPickerView) colorPickerView = new editor.ColorPickerView();
                    colorPickerView.color = this.minMaxGradient.getValue(0);
                    var pos = this.localToGlobal(0, 0);
                    // pos.x = pos.x - colorPickerView.width;
                    pos.x = pos.x - 318;
                    colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    popupview.popupView(colorPickerView, () =>
                    {
                        colorPickerView.removeEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    }, pos.x, pos.y);
                    break;
                case this.modeBtn:
                    menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, (v) =>
                    {
                        this.minMaxGradient.mode = v;
                    }, { width: 210 });
                    break;
            }
        }

        private onPickerViewChanged()
        {
            (<feng3d.MinMaxGradientColor>this.minMaxGradient.minMaxGradient).color = <feng3d.Color4>colorPickerView.color;

            this.updateView();
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

    }
}