namespace editor
{
    /**
     * 最大最小颜色渐变界面
     * 
     * editor.editorui.maskLayer.addChild(new editor.MinMaxGradientView())
     */
    export class MinMaxGradientView extends eui.Component
    {
        //
        @feng3d.watch("_onMinMaxGradientChanged")
        minMaxGradient = new feng3d.MinMaxGradient();

        public colorRect: eui.Rect;
        public alphaRect: eui.Rect;
        public modeBtn: eui.Button;

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

            this.colorRect.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            this.updateView();
        }

        $onRemoveFromStage()
        {
            this.colorRect.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);

            super.$onRemoveFromStage()
        }

        updateView()
        {
            var color = (<feng3d.MinMaxGradientColor>this.minMaxGradient.minMaxGradient).color;
            this.colorRect.fillColor = color.toColor3().toInt();
            this.alphaRect.percentWidth = color.a * 100;
        }

        private _onMinMaxGradientChanged()
        {
            if (this.stage) this.updateView();
        }

        private onClick(e: egret.MouseEvent)
        {
            switch (e.currentTarget)
            {
                case this.colorRect:
                    if (!colorPickerView) colorPickerView = new editor.ColorPickerView();
                    colorPickerView.color = this.minMaxGradient.getValue(0).toColor3();
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
            (<feng3d.MinMaxGradientColor>this.minMaxGradient.minMaxGradient).color = colorPickerView.color.toColor4();

            this.updateView();
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        }

    }
}