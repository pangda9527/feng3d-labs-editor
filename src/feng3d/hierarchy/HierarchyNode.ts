namespace editor
{
    export class HierarchyNode extends TreeNode
    {
        isOpen = false;

        /**
         * 游戏对象
         */
        gameobject: feng3d.GameObject;
        /** 
         * 父结点
         */
        parent: HierarchyNode = null;
        /**
         * 子结点列表
         */
        children: HierarchyNode[] = [];

        constructor(obj: gPartial<HierarchyNode>)
        {
            super(obj);

            feng3d.watcher.watch(this.gameobject, "name", this.update, this);

            this.update();
        }

        /**
         * 提供拖拽数据
         * 
         * @param dragSource 
         */
        setdargSource(dragSource: DragData)
        {
            dragSource.addDragData("gameobject", this.gameobject);
        }

        /**
         * 接受拖拽数据
         * 
         * @param dragdata 
         */
        acceptDragDrop(dragdata: DragData)
        {
            dragdata.getDragData("gameobject").forEach(v =>
            {
                if (!v.contains(this.gameobject))
                {
                    if (this.gameobject != v.parent)
                    {
                        var localToWorldMatrix = v.transform.localToWorldMatrix
                        this.gameobject.addChild(v);
                        v.transform.localToWorldMatrix = localToWorldMatrix;
                    }
                }
            });
            dragdata.getDragData("file_gameobject").forEach(v =>
            {
                hierarchy.addGameoObjectFromAsset(v, this.gameobject);
            });
            dragdata.getDragData("file_script").forEach(v =>
            {
                this.gameobject.addScript(v.scriptName);
            })

        }

        /**
         * 销毁
         */
        destroy()
        {
            feng3d.watcher.unwatch(this.gameobject, "name", this.update, this);

            this.gameobject = null;
            super.destroy();
        }

        private update()
        {
            this.label = this.gameobject.name;
        }
    }
}