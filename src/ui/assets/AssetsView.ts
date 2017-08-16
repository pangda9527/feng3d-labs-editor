namespace feng3d.editor
{
    export class AssetsView extends eui.Component implements eui.UIComponent
    {
        assetsTree: feng3d.editor.Tree;

        private listData: eui.ArrayCollection;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AssetsView";
        }

        private onComplete(): void
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            console.log("AssetsView.onComplete");

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
            this.listData = this.assetsTree.dataProvider = new eui.ArrayCollection();

            // this.listData.replaceAll(nodes);

            console.log("AssetsView.onAddedToStage");
        }

        private onRemovedFromStage()
        {
        }
    }
}