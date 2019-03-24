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

            drag.register(this, this.setdargSource.bind(this), ["gameobject", "file_gameobject", "file_script"], (dragdata: DragData) =>
            {
                if (dragdata.gameobject)
                {
                    if (!dragdata.gameobject.contains(this.data.gameobject))
                    {
                        var localToWorldMatrix = dragdata.gameobject.transform.localToWorldMatrix
                        this.data.gameobject.addChild(dragdata.gameobject);
                        dragdata.gameobject.transform.localToWorldMatrix = localToWorldMatrix;
                    }
                }
                if (dragdata.file_gameobject)
                {
                    hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, this.data.gameobject);
                }
                if (dragdata.file_script)
                {
                    this.data.gameobject.addScript(dragdata.file_script.scriptName);
                }
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

        private setdargSource(dragSource: DragData)
        {
            dragSource.gameobject = this.data.gameobject;
        }

        private onclick()
        {
            editorData.selectObject(this.data.gameobject);
        }

        private onDoubleClick()
        {
            feng3d.shortcut.dispatch("lookToSelectedGameObject");
        }

        private onrightclick()
        {
            var menus: MenuItem[] = [];
            //scene3d无法删除
            if (this.data.gameobject.scene.gameObject != this.data.gameobject)
            {
                menus.push(
                    {
                        label: "删除", click: () =>
                        {
                            this.data.gameobject.parent.removeChild(this.data.gameobject);
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