import { Canvas, GameObject, GameObjectAsset, globalEmitter, HideFlags, IEvent, Transform2D, watcher } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { HierarchyNode } from './HierarchyNode';

export var hierarchy: Hierarchy;

export class Hierarchy
{
    rootnode: HierarchyNode;

    rootGameObject: GameObject;

    constructor()
    {
        globalEmitter.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
        watcher.watch(<Hierarchy>this, "rootGameObject", this.rootGameObjectChanged, this);
    }

    /**
     * 获取选中结点
     */
    getSelectedNode()
    {
        var node = EditorData.editorData.selectedGameObjects.reduce((pv: HierarchyNode, cv) => { pv = pv || this.getNode(cv); return pv; }, null);
        return node;
    }

    /**
     * 获取结点
     */
    getNode(gameObject: GameObject)
    {
        var node = nodeMap.get(gameObject);
        return node;
    }

    delete(gameobject: GameObject)
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
    addGameObject(gameobject: GameObject)
    {
        if (gameobject.getComponent(Transform2D))
        {
            this.addUI(gameobject);
            return;
        }

        var selectedNode = this.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            this.rootnode.gameobject.addChild(gameobject);
        EditorData.editorData.selectObject(gameobject);
    }

    /**
     * 添加UI
     * 
     * @param gameobject 
     */
    addUI(gameobject: GameObject)
    {
        var selectedNode = this.getSelectedNode();
        if (selectedNode && selectedNode.gameobject.getComponent(Transform2D))
        {
            selectedNode.gameobject.addChild(gameobject);
        }
        else
        {
            var canvas = this.rootnode.gameobject.getComponentsInChildren(Canvas)[0];
            if (!canvas)
            {
                canvas = GameObject.createPrimitive("Canvas").getComponent(Canvas);
                this.rootnode.gameobject.addChild(canvas.gameObject);
            }
            canvas.gameObject.addChild(gameobject);
        }
        EditorData.editorData.selectObject(gameobject);
    }

    addGameoObjectFromAsset(gameobjectAsset: GameObjectAsset, parent?: GameObject)
    {
        var gameobject = gameobjectAsset.getAssetData();

        console.assert(!gameobject.parent);

        if (parent)
            parent.addChild(gameobject);
        else
            this.rootnode.gameobject.addChild(gameobject);
        EditorData.editorData.selectObject(gameobject);
        return gameobject;
    }

    private _selectedGameObjects: GameObject[] = [];

    private rootGameObjectChanged(newValue: GameObject, oldValue: GameObject)
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
        this._selectedGameObjects = EditorData.editorData.selectedGameObjects.concat();
        this._selectedGameObjects.forEach(element =>
        {
            var node = this.getNode(element);
            node.selected = true;
        });
    }

    private ongameobjectadded(event: IEvent<{ parent: GameObject; child: GameObject; }>)
    {
        this.add(event.data.child);
    }

    private ongameobjectremoved(event: IEvent<{ parent: GameObject; child: GameObject; }>)
    {
        var node = nodeMap.get(event.data.child);
        this.remove(node);
    }

    private init(gameobject: GameObject)
    {
        if (this.rootnode)
            this.rootnode.destroy();

        nodeMap.clear();

        var node = new HierarchyNode({ gameobject: <any>gameobject });
        nodeMap.set(gameobject, node);
        node.isOpen = true;

        this.rootnode = node;
        gameobject.children.forEach(element =>
        {
            this.add(element);
        });
    }

    private add(gameobject: GameObject)
    {
        if (gameobject.hideFlags & HideFlags.HideInHierarchy)
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
                node = new HierarchyNode({ gameobject: <any>gameobject });
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
var nodeMap = new Map<GameObject, HierarchyNode>();

hierarchy = new Hierarchy();
