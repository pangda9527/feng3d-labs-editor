import { HierarchyNode } from "./HierarchyNode";
export declare var hierarchy: Hierarchy;
export declare class Hierarchy {
    rootnode: HierarchyNode;
    rootGameObject: feng3d.GameObject;
    constructor();
    /**
     * 获取选中结点
     */
    getSelectedNode(): HierarchyNode;
    /**
     * 获取结点
     */
    getNode(gameObject: feng3d.GameObject): HierarchyNode;
    delete(gameobject: feng3d.GameObject): void;
    /**
     * 添加游戏对象到层级树
     *
     * @param gameobject 游戏对象
     */
    addGameObject(gameobject: feng3d.GameObject): void;
    addGameoObjectFromAsset(gameobject: feng3d.GameObject, parent?: feng3d.GameObject): void;
    private _selectedGameObjects;
    private rootGameObjectChanged;
    private onSelectedGameObjectChanged;
    private ongameobjectadded;
    private ongameobjectremoved;
    private init;
    private add;
    private remove;
}
//# sourceMappingURL=Hierarchy.d.ts.map