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

            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            this.selectedfilechanged();
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
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
                        if (editorData.selectedAssetNodes.indexOf(this.data) != -1)
                        {
                            dragsource.assetNodes = editorData.selectedAssetNodes.concat();
                        } else
                        {
                            dragsource.assetNodes = [this.data];
                        }
                    }, ["assetNodes"], (dragdata) =>
                        {
                            dragdata.assetNodes.forEach(v =>
                            {
                                editorRS.moveAsset(v.asset, folder, (err) =>
                                {
                                    if (!err)
                                    {
                                        this.data.addChild(v);
                                    } else
                                    {
                                        alert(err.message);
                                    }
                                });
                            });
                        });
                }
                else
                {
                    if (!this.data.isLoaded)
                    {
                        var data = this.data;
                        data.load(() =>
                        {
                            feng3d.assert(data.isLoaded);
                            if (data == this.data) this.dataChanged();
                        })
                        return;
                    }

                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.asset.assetType;
                        switch (extension)
                        {
                            case feng3d.AssetExtension.gameobject:
                                dragsource.file_gameobject = feng3d.serialization.clone(<feng3d.GameObject>this.data.asset.data);
                                break;
                            case feng3d.AssetExtension.script:
                                dragsource.file_script = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.anim:
                                dragsource.animationclip = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.material:
                                dragsource.material = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.texturecube:
                                dragsource.texturecube = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.geometry:
                                dragsource.geometry = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.texture:
                                dragsource.texture2d = <any>this.data.asset.data;
                                break;
                            case feng3d.AssetExtension.audio:
                                dragsource.audio = <any>this.data.asset.data;
                                break;
                        }
                        if (editorData.selectedAssetNodes.indexOf(this.data) != -1)
                        {
                            dragsource.assetNodes = editorData.selectedAssetNodes.concat();
                        } else
                        {
                            dragsource.assetNodes = [this.data];
                        }
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
                    engine.scene = scene;
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