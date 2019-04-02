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