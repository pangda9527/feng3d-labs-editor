namespace editor
{
    export class HierarchyTreeItemRenderer extends TreeItemRenderer
    {
        public renameInput: RenameTextInput;

        /**
         * 上一个选中项
         */
        static preSelectedItem: HierarchyTreeItemRenderer;

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
                    dragdata.file_script.getScriptClassName(scriptClassName =>
                    {
                        this.data.gameobject.addScript(scriptClassName);
                    });
                }
            });
            //
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        }

        $onRemoveFromStage()
        {
            drag.unregister(this);

            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
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

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                this.renameInput.text = this.data.label;
            } else
            {
            }
        }

        private onrightclick(e)
        {
            var menuconfig: MenuItem[] = [];
            //scene3d无法删除
            if (this.data.gameobject.scene.gameObject != this.data.gameobject)
            {
                menuconfig.push(
                    {
                        label: "删除", click: () =>
                        {
                            this.data.gameobject.parent.removeChild(this.data.gameobject);
                        }
                    },
                    {
                        label: "重命名", click: () =>
                        {
                            this.renameInput.edit(() =>
                            {
                                this.data.gameobject.name = this.renameInput.text;
                            });
                        }
                    }
                );
            }

            menuconfig = menuconfig.concat({ type: 'separator' }, createObjectConfig);

            if (menuconfig.length > 0)
                menu.popup(menuconfig);
        }
    }
}