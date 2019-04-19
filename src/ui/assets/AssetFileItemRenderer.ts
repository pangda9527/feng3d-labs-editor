namespace editor
{
    export class AssetFileItemRenderer extends eui.ItemRenderer
    {
        public icon: eui.Image;

        data: AssetNode;
        itemSelected = false;

        constructor()
        {
            super();
            this.skinName = "AssetFileItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            this.selectedfilechanged();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            feng3d.dispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                if (this.data.isDirectory)
                {
                    var folder = <feng3d.FolderAsset>this.data.asset;
                    drag.register(this, (dragsource) =>
                    {
                        this.data.setdargSource(dragsource);
                    }, ["assetNodes"], (dragdata) =>
                        {
                            this.data.acceptDragDrop(dragdata);
                        });
                }
                else
                {
                    if (!this.data.isLoaded)
                    {
                        var data = this.data;
                        data.load(() =>
                        {
                            feng3d.debuger && console.assert(data.isLoaded);
                            if (data == this.data) this.dataChanged();
                        })
                        return;
                    }

                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.asset.assetType;
                        switch (extension)
                        {
                            case feng3d.AssetType.gameobject:
                                dragsource.addDragData("file_gameobject", feng3d.serialization.clone(<feng3d.GameObject>this.data.asset.data));
                                break;
                            case feng3d.AssetType.script:
                                dragsource.addDragData("file_script", <any>this.data.asset);
                                break;
                            case feng3d.AssetType.anim:
                                dragsource.addDragData("animationclip", <any>this.data.asset.data);
                                break;
                            case feng3d.AssetType.material:
                                dragsource.addDragData("material", <any>this.data.asset.data);
                                break;
                            case feng3d.AssetType.texturecube:
                                dragsource.addDragData("texturecube", <any>this.data.asset.data);
                                break;
                            case feng3d.AssetType.geometry:
                                dragsource.addDragData("geometry", <any>this.data.asset.data);
                                break;
                            case feng3d.AssetType.texture:
                                dragsource.addDragData("texture2d", <any>this.data.asset.data);
                                break;
                            case feng3d.AssetType.audio:
                                dragsource.addDragData("audio", <any>this.data.asset.data);
                                break;
                        }
                        dragsource.addDragData("assetNodes", this.data);
                    }, []);
                }
            } else
            {
                drag.unregister(this);
            }
            this.selectedfilechanged();
        }

        private ondoubleclick()
        {
            if (this.data.isDirectory)
            {
                editorAsset.showFloder = this.data;
            } else if (this.data.asset instanceof feng3d.GameObject)
            {
                var scene = this.data.asset.getComponent(feng3d.Scene3D);
                if (scene)
                {
                    editorData.gameScene = scene;
                }
            }
        }

        private onclick()
        {
            // 处理按下shift键时
            var isShift = feng3d.shortcut.keyState.getKeyState("shift");
            if (isShift)
            {
                var source = (<eui.ArrayCollection>(<eui.List>this.parent).dataProvider).source;
                var index = source.indexOf(this.data);
                var min = index, max = index;
                if (editorData.selectedAssetNodes.indexOf(preAssetFile) != -1)
                {
                    index = source.indexOf(preAssetFile);
                    if (index < min) min = index;
                    if (index > max) max = index;
                }
                editorData.selectMultiObject(source.slice(min, max + 1));
            } else
            {
                editorData.selectObject(this.data);
                preAssetFile = this.data;
            }
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();
            editorData.selectObject(this.data);
            editorAsset.popupmenu(this.data);
        }

        private selectedfilechanged()
        {
            var selectedAssetFile = editorData.selectedAssetNodes;
            var selected = this.data ? selectedAssetFile.indexOf(this.data) != -1 : false;
            if (this.itemSelected != selected)
            {
                this.itemSelected = selected;
            }
        }
    }
    var preAssetFile: AssetNode;
}