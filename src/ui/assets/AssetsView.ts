namespace feng3d.editor
{
    export class AssetsView extends eui.Component implements eui.UIComponent
    {
        public list: eui.List;
        private listData: eui.ArrayCollection;

        constructor()
        {
            super();
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.skinName = "AssetsView";
        }

        private onComplete(): void
        {
            this.list.itemRenderer = TreeItemRenderer;

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

            if (this.stage)
            {
                this.onAddedToStage();
            }
        }

        private onAddedToStage()
        {
            this.listData = this.list.dataProvider = new eui.ArrayCollection();
            this.initlist();
        }

        private onRemovedFromStage()
        {

        }

        private initlist()
        {
            project.init(editor3DData.projectRoot, (err, fileInfo) =>
            {
                var rootNode = new AssetsNode(fileInfo);

                // var rootNode = new TreeNode();
                // rootNode.label = "root";
                // rootNode.depth = -1;

                // var AssetsNode = new TreeNode();
                // AssetsNode.label = "Assets";
                // rootNode.addNode(AssetsNode);

                var nodes = rootNode.getShowNodes();
                this.listData.replaceAll(nodes);

                rootNode.on("openChanged", () =>
                {
                    var nodes = rootNode.getShowNodes();
                    this.listData.replaceAll(nodes);
                }, this);
            });
        }
    }
}