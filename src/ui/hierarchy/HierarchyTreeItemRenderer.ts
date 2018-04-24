namespace feng3d.editor
{
    export class HierarchyTreeItemRenderer extends TreeItemRenderer
    {
        /**
         * 上一个选中项
         */
        static preSelectedItem: HierarchyTreeItemRenderer;

        data: HierarchyNode;

        constructor()
        {
            super();
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

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
                    this.data.gameobject.addScript(dragdata.file_script);
                }
            });
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            drag.unregister(this);
        }

        private setdargSource(dragSource: DragData)
        {
            dragSource.gameobject = this.data.gameobject;
        }

        private onclick()
        {
            HierarchyTreeItemRenderer.preSelectedItem = this;

            editorData.selectObject(this.data.gameobject);
        }

        private onrightclick(e)
        {
            var menuconfig: MenuItem[] = [];
            //scene3d无法删除
            if (this.data.gameobject.scene.gameObject != this.data.gameobject)
            {
                menuconfig.push({
                    label: "delete", click: () =>
                    {
                        this.data.gameobject.parent.removeChild(this.data.gameobject);
                    }
                });
            }

            menuconfig = menuconfig.concat({ type: 'separator' }, createObjectConfig);

            if (menuconfig.length > 0)
                menu.popup(menuconfig);
        }
    }
}