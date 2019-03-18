import { HierarchyNode } from "./HierarchyNode";
import { editorData } from "../../global/EditorData";

export var hierarchy: Hierarchy;

export class Hierarchy
{
    rootnode: HierarchyNode;

    @feng3d.watch("rootGameObjectChanged")
    rootGameObject: feng3d.GameObject;

    constructor()
    {
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
    }

    /**
     * 获取选中结点
     */
    getSelectedNode()
    {
        var node = editorData.selectedGameObjects.reduce((pv: HierarchyNode, cv) => { pv = pv || this.getNode(cv); return pv; }, null);
        return node;
    }

    /**
     * 获取结点
     */
    getNode(gameObject: feng3d.GameObject)
    {
        var node = nodeMap.get(gameObject);
        return node;
    }

    delete(gameobject: feng3d.GameObject)
    {
        var node = nodeMap.get(gameobject);
        if (node)
        {
            node.destroy();
            nodeMap.delete(gameobject);
        }
    }

    /**
     * 添加游戏对象到层级树
     * 
     * @param gameobject 游戏对象
     */
    addGameObject(gameobject: feng3d.GameObject)
    {
        var selectedNode = this.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            this.rootnode.gameobject.addChild(gameobject);
        editorData.selectObject(gameobject);
    }

    addGameoObjectFromAsset(gameobject: feng3d.GameObject, parent?: feng3d.GameObject)
    {
        gameobject = feng3d.serialization.clone(gameobject);

        if (parent)
            parent.addChild(gameobject);
        else
            this.rootnode.gameobject.addChild(gameobject);
        editorData.selectObject(gameobject);
    }

    private _selectedGameObjects: feng3d.GameObject[] = [];

    private rootGameObjectChanged(property, oldValue: feng3d.GameObject, newValue: feng3d.GameObject)
    {
        if (oldValue)
        {
            oldValue.off("addChild", this.ongameobjectadded, this);
            oldValue.off("removeChild", this.ongameobjectremoved, this);
        }
        if (newValue)
        {
            this.init(newValue);
            newValue.on("addChild", this.ongameobjectadded, this);
            newValue.on("removeChild", this.ongameobjectremoved, this);
        }
    }

    private onSelectedGameObjectChanged()
    {
        this._selectedGameObjects.forEach(element =>
        {
            var node = this.getNode(element);
            if (node)
                node.selected = false;
            else
                debugger; // 为什么为空，是否被允许？
        });
        this._selectedGameObjects = editorData.selectedGameObjects.concat();
        this._selectedGameObjects.forEach(element =>
        {
            var node = this.getNode(element);
            node.selected = true;
            node.openParents();
        });
    }

    private ongameobjectadded(event: feng3d.Event<feng3d.GameObject>)
    {
        this.add(event.data);
    }

    private ongameobjectremoved(event: feng3d.Event<feng3d.GameObject>)
    {
        var node = nodeMap.get(event.data);
        this.remove(node);
    }

    private init(gameobject: feng3d.GameObject)
    {
        if (this.rootnode)
            this.rootnode.destroy();

        nodeMap.clear();

        var node = new HierarchyNode({ gameobject: gameobject });
        nodeMap.set(gameobject, node);
        node.isOpen = true;

        this.rootnode = node;
        gameobject.children.forEach(element =>
        {
            this.add(element);
        });
    }

    private add(gameobject: feng3d.GameObject)
    {
        if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
            return;
        var node = nodeMap.get(gameobject);
        if (node)
        {
            node.remove();
        }
        var parentnode = nodeMap.get(gameobject.parent);
        if (parentnode)
        {
            if (!node)
            {
                node = new HierarchyNode({ gameobject: gameobject });
                nodeMap.set(gameobject, node);
            }
            parentnode.addChild(node);
        }
        gameobject.children.forEach(element =>
        {
            this.add(element);
        });
        return node;
    }

    private remove(node: HierarchyNode)
    {
        if (!node) return;
        node.children.forEach(element =>
        {
            this.remove(element);
        });
        node.remove();
    }
}
var nodeMap = new Map<feng3d.GameObject, HierarchyNode>();

hierarchy = new Hierarchy();