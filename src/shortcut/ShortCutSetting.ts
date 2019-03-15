namespace editor
{
    /**
     * 快捷键设置界面
     */
    export class ShortCutSetting extends eui.Component
    {
        public lab: eui.Label;
        public rect: eui.Rect;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "ShortCutSetting";
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
            console.log(`onAddedToStage`)
        }

        private onRemovedFromStage()
        {
            console.log(`onRemovedFromStage`)
        }

        static get instance()
        {
            return this["_instance"] = this["_instance"] || new ShortCutSetting();
        }
    }

}