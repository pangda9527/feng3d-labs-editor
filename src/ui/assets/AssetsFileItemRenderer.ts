namespace editor
{
    export class AssetsFileItemRenderer extends eui.ItemRenderer
    {
        public icon: eui.Image;

        public renameInput: RenameTextInput;

        data: AssetsFile;

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
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                this.renameInput.text = this.data.label;
                this.renameInput.textAlign = egret.HorizontalAlign.CENTER;

                var accepttypes = [];
                if (this.data.isDirectory)
                {
                    drag.register(this, (dragsource) =>
                    {
                        dragsource.file = this.data.path;
                    }, ["file"], (dragdata) =>
                        {
                            var movefile = editorAssets.getFile(dragdata.file);
                            movefile.moveToDir(this.data.path);
                        });
                }
                else
                {
                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.extension;
                        switch (extension)
                        {
                            case feng3d.AssetExtension.gameobject:
                                dragsource.file_gameobject = this.data.path;
                                break;
                            case feng3d.AssetExtension.script:
                                this.data.getScriptClassName((scriptClassName) =>
                                {
                                    dragsource.file_script = scriptClassName;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.anim:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.animationclip = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.material:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.material = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.texturecube:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.texturecube = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.geometry:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.geometry = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.png:
                            case feng3d.AssetExtension.jpg:
                            case feng3d.AssetExtension.jpeg:
                            case feng3d.AssetExtension.gif:
                                dragsource.image = this.data.path;
                                break;
                            case feng3d.AssetExtension.mp3:
                            case feng3d.AssetExtension.ogg:
                            case feng3d.AssetExtension.wav:
                                dragsource.audio = this.data.path;
                                break;
                        }
                        dragsource.file = this.data.path;
                    }, []);
                }
            } else
            {
                drag.unregister(this);
            }
        }

        private ondoubleclick()
        {
            if (this.data.isDirectory)
            {
                editorAssets.showFloder = this.data;
            } else if (this.data.extension == feng3d.AssetExtension.scene)
            {
                this.data.getData((data: feng3d.GameObject) =>
                {
                    var scene = data.getComponent(feng3d.Scene3D);
                    scene.initCollectComponents();
                    engine.scene = scene;
                });
            }
        }

        private onclick()
        {
            editorData.selectObject(this.data);
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();

            var othermenus = {
                rename: {
                    label: "重命名",
                    click: () =>
                    {
                        this.renameInput.edit(() =>
                        {
                            var newName = this.data.name.replace(this.data.label, this.renameInput.text);
                            this.data.rename(newName);
                        });
                    }
                }
            }
            editorAssets.popupmenu(this.data, othermenus);
        }
    }
}