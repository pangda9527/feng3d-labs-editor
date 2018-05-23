namespace feng3d.editor
{
    export class HierarchyNode extends TreeNode
    {
        isOpen = false;

        /**
         * 游戏对象
         */
        gameobject: GameObject;
        /** 
         * 父节点
         */
        parent: HierarchyNode = null;
        /**
         * 子节点列表
         */
        children: HierarchyNode[] = [];

        constructor(obj: gPartial<HierarchyNode>)
        {
            super(obj);

            watcher.watch(editorData, "selectedObjects", this.onSelectedGameObjectChanged, this);
            watcher.watch(this.gameobject, "name", this.update, this);

            this.update();
        }

        /**
         * 销毁
         */
        destroy()
        {
            watcher.unwatch(editorData, "selectedObjects", this.onSelectedGameObjectChanged, this);
            watcher.unwatch(this.gameobject, "name", this.update, this);

            this.gameobject = null;
            super.destroy();
        }

        private update()
        {
            this.label = this.gameobject.name;
        }

        private onSelectedGameObjectChanged()
        {
            var selectedGameObjects = editorData.selectedGameObjects;
            var isselected = selectedGameObjects.indexOf(this.gameobject) != -1;
            if (this.selected != isselected)
            {
                this.selected = isselected;
                if (this.selected)
                {
                    //新增选中效果
                    var wireframeComponent = this.gameobject.getComponent(WireframeComponent);
                    if (!wireframeComponent)
                        this.gameobject.addComponent(WireframeComponent);
                } else
                {
                    //清除选中效果
                    var wireframeComponent = this.gameobject.getComponent(WireframeComponent);
                    if (wireframeComponent)
                        this.gameobject.removeComponent(wireframeComponent);
                }
            }
        }
    }
}