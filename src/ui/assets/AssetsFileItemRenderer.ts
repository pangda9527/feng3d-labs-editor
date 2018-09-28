namespace editor
{
    export class AssetsFileItemRenderer extends eui.ItemRenderer
    {
        public icon: eui.Image;

        data: AssetsFile;
        itemSelected = false;

        constructor()
        {
            super();
            this.skinName = "AssetsFileItemRenderer";
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
                    drag.register(this, (dragsource) =>
                    {
                        dragsource.assetsFile = this.data;
                    }, ["assetsFile"], (dragdata) =>
                        {
                            this.data.addChild(dragdata.assetsFile);
                        });
                }
                else
                {
                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.feng3dAssets.assetType;
                        switch (extension)
                        {
                            case feng3d.AssetExtension.gameobject:
                                dragsource.file_gameobject = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.script:
                                dragsource.file_script = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.anim:
                                dragsource.animationclip = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.material:
                                dragsource.material = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.texturecube:
                                dragsource.texturecube = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.geometry:
                                dragsource.geometry = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.texture2d:
                                dragsource.texture2d = <any>this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.audio:
                                dragsource.audio = <any>this.data.feng3dAssets;
                                break;
                        }
                        dragsource.assetsFile = this.data;
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
                editorAssets.showFloder = this.data;
            } else if (this.data.feng3dAssets instanceof feng3d.GameObject)
            {
                var scene = this.data.feng3dAssets.getComponent(feng3d.Scene3D);
                if (scene)
                {
                    scene.initCollectComponents();
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
                if (editorData.selectedAssetsFile.indexOf(preAssetsFile) != -1)
                {
                    index = source.indexOf(preAssetsFile);
                    if (index < min) min = index;
                    if (index > max) max = index;
                }
                editorData.selectMiltiObject(source.slice(min, max + 1));
            } else
            {
                editorData.selectObject(this.data);
                preAssetsFile = this.data;
            }
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();
            editorAssets.popupmenu(this.data);
        }

        private selectedfilechanged()
        {
            var selectedAssetsFile = editorData.selectedAssetsFile;
            var selected = this.data ? selectedAssetsFile.indexOf(this.data) != -1 : false;
            if (this.itemSelected != selected)
            {
                this.itemSelected = selected;
            }
        }
    }
    var preAssetsFile: AssetsFile;
}