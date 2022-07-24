import { GameObject, serialization, shortcut } from 'feng3d';
import { menuConfig } from '../../configs/CommonConfig';
import { HierarchyNode } from '../../feng3d/hierarchy/HierarchyNode';
import { EditorData } from '../../global/EditorData';
import { menu, MenuItem } from '../components/Menu';
import { MouseOnDisableScroll } from '../components/tools/MouseOnDisableScroll';
import { TreeItemRenderer } from '../components/TreeItemRenderer';
import { drag, DragData } from '../drag/Drag';

export class HierarchyTreeItemRenderer extends TreeItemRenderer
{
    data: HierarchyNode;

    constructor()
    {
        super();
        this.skinName = "HierarchyTreeItemRenderer";
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);

        drag.register(this, (dragSource: DragData) =>
        {
            this.data.setdargSource(dragSource)
        }, ["gameobject", "file_gameobject", "file_script"], (dragdata: DragData) =>
        {
            this.data.acceptDragDrop(dragdata);
        });
        MouseOnDisableScroll.register(this);
        //
        this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
    }

    $onRemoveFromStage()
    {
        drag.unregister(this);
        MouseOnDisableScroll.unRegister(this);

        super.$onRemoveFromStage();
        this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
    }

    private onclick()
    {
        EditorData.editorData.selectObject(this.data.gameobject);
    }

    private onDoubleClick()
    {
        shortcut.emit("lookToSelectedGameObject");
    }

    private onrightclick()
    {
        var menus: MenuItem[] = [];
        //scene无法删除
        if (this.data.gameobject.scene.gameObject != this.data.gameobject)
        {
            menus.push(
                {
                    label: "复制", click: () =>
                    {
                        var objects = EditorData.editorData.selectedObjects.filter(v => v instanceof GameObject);
                        EditorData.editorData.copyObjects = objects;
                    }
                },
                {
                    label: "粘贴", click: () =>
                    {
                        var undoSelectedObjects = EditorData.editorData.selectedObjects;
                        //
                        var objects: GameObject[] = EditorData.editorData.copyObjects.filter(v => v instanceof GameObject);
                        if (objects.length == 0) return;
                        var newGameObjects = objects.map(v => serialization.clone(v));
                        newGameObjects.forEach(v =>
                        {
                            this.data.gameobject.parent.addChild(v);
                        });
                        EditorData.editorData.selectMultiObject(newGameObjects);

                        // undo
                        EditorData.editorData.undoList.push(() =>
                        {
                            newGameObjects.forEach(v =>
                            {
                                v.remove();
                            });
                            EditorData.editorData.selectMultiObject(undoSelectedObjects, false);
                        });
                    }
                },
                { type: 'separator' },
                {
                    label: "副本", click: () =>
                    {
                        var undoSelectedObjects = EditorData.editorData.selectedObjects;
                        //
                        var objects = EditorData.editorData.selectedObjects.filter(v => v instanceof GameObject);
                        var newGameObjects = objects.map(v =>
                        {
                            var no = serialization.clone(v);
                            v.parent.addChild(no);
                            return no;
                        });
                        EditorData.editorData.selectMultiObject(newGameObjects);

                        // undo
                        EditorData.editorData.undoList.push(() =>
                        {
                            newGameObjects.forEach(v =>
                            {
                                v.remove();
                            });
                            EditorData.editorData.selectMultiObject(undoSelectedObjects, false);
                        });
                    }
                },
                {
                    label: "删除", click: () =>
                    {
                        this.data.gameobject.parent.removeChild(this.data.gameobject);
                        var index = EditorData.editorData.selectedObjects.indexOf(this.data.gameobject);
                        if (index != -1)
                        {
                            var selectedObjects = EditorData.editorData.selectedObjects.concat();
                            selectedObjects.splice(index, 1);
                            EditorData.editorData.selectMultiObject(selectedObjects);
                        }
                    }
                }
            );
        }

        menus = menus.concat({ type: 'separator' }, menuConfig.getCreateObjectMenu());

        if (menus.length > 0)
            menu.popup(menus);
    }
}
