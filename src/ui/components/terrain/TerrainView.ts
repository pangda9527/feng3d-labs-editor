namespace editor
{
    export class TerrainView extends eui.Component
    {
        public constructor()
        {
            super();
            this.skinName = "TerrainView";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.updateView();
        }

        $onRemoveFromStage()
        {

            super.$onRemoveFromStage()
        }

        updateView()
        {
            if (!this.stage) return;

        }


    }
}