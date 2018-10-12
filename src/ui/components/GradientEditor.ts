namespace editor
{
    export class GradientEditor extends eui.Component
    {
        public constructor()
        {
            super();
            this.skinName = "GradientEditor";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

        }

        $onRemoveFromStage()
        {

            super.$onRemoveFromStage()
        }
    }
    export var gradientEditor: GradientEditor;
}