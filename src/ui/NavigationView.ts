namespace editor
{
    export class NavigationView extends eui.Component implements ModuleView
    {
        moduleName: string;

        constructor()
        {
            super();

            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "NavigationView";
            this.moduleName = "Navigation";
        }

        private onComplete(): void
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
        }

        private onRemovedFromStage()
        {
        }
    }
}