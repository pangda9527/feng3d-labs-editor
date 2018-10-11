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

            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onModeBtnClick, this);
        }

        $onRemoveFromStage()
        {

            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onModeBtnClick, this);
            super.$onRemoveFromStage()
        }


        private _onMinMaxGradientChanged()
        {

        }

        private onModeBtnClick(e: egret.MouseEvent)
        {
            menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, (v) =>
            {
                this.minMaxGradient.mode = v;
            });
        }

    }
}