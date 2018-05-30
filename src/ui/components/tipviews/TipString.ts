namespace editor
{
    /**
     * String 提示框
     */
    export class TipString extends eui.Component implements eui.UIComponent
    {
        public txtLab: eui.Label;

        constructor()
        {
            super();
            this.skinName = "TipString";
        }

        @feng3d.watch("valuechanged")
        value = "";

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.txtLab.text = String(this.value);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage()

        }

        private valuechanged()
        {
            if (this.txtLab)
            {
                this.txtLab.text = String(this.value);
            }
        }

    }

}