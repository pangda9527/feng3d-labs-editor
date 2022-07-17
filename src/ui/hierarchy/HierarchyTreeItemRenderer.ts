namespace editor
{
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
            editorData.selectObject(this.data.gameobject);
        }

        private onDoubleClick()
        {
            feng3d.shortcut.emit("lookToSelectedGameObject");
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
                            var objects = editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
                            editorData.copyObjects = objects;
                        }
                    },
                    {
                        label: "粘贴", click: () =>
                        {
                            var undoSelectedObjects = editorData.selectedObjects;
                            //
                            var objects: feng3d.GameObject[] = editorData.copyObjects.filter(v => v instanceof feng3d.GameObject);
                            if (objects.length == 0) return;
                            var newGameObjects = objects.map(v => feng3d.serialization.clone(v));
                            newGameObjects.forEach(v =>
                            {
                                this.data.gameobject.parent.addChild(v);
                            });
                            editorData.selectMultiObject(newGameObjects);

                            // undo
                            editorData.undoList.push(() =>
                            {
                                newGameObjects.forEach(v =>
                                {
                                    v.remove();
                                });
                                editorData.selectMultiObject(undoSelectedObjects, false);
                            });
                        }
                    },
                    { type: 'separator' },
                    {
                        label: "副本", click: () =>
                        {
                            var undoSelectedObjects = editorData.selectedObjects;
                            //
                            var objects = editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
                            var newGameObjects = objects.map(v =>
                            {
                                var no = feng3d.serialization.clone(v);
                                v.parent.addChild(no);
                                return no;
                            });
                            editorData.selectMultiObject(newGameObjects);

                            // undo
                            editorData.undoList.push(() =>
                            {
                                newGameObjects.forEach(v =>
                                {
                                    v.remove();
                                });
                                editorData.selectMultiObject(undoSelectedObjects, false);
                            });
                        }
                    },
                    {
                        label: "删除", click: () =>
                        {
                            this.data.gameobject.parent.removeChild(this.data.gameobject);
                            var index = editorData.selectedObjects.indexOf(this.data.gameobject);
                            if (index != -1)
                            {
                                var selectedObjects = editorData.selectedObjects.concat();
                                selectedObjects.splice(index, 1);
                                editorData.selectMultiObject(selectedObjects);
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
}