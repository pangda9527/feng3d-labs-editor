import { TreeNode } from "../../ui/components/TreeNode";

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