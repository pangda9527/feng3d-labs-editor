namespace feng3d.editor
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
            this.renameInput.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            this.renameInput.addEventListener(egret.Event.CHANGE, this.reanmeInputChange, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            this.renameInput.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            this.renameInput.addEventListener(egret.Event.CHANGE, this.reanmeInputChange, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                this.renameInput.text = this.data.label;

                var accepttypes = [];
                if (this.data.isDirectory)
                {
                    drag.register(this, (dragsource) =>
                    {
                        this.data.setDragSource(dragsource);
                    }, ["file"], (dragdata) =>
                        {
                            var movefile = editorAssets.getFile(dragdata.file);
                            movefile.move(this.data.path);
                        });
                }
                else
                {
                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.extension;
                        switch (extension)
                        {
                            case AssetExtension.gameobject:
                                dragsource.file_gameobject = this.data.path;
                                break;
                            case AssetExtension.ts:
                                dragsource.file_script = this.data.path;
                                break;
                            case AssetExtension.anim:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.animationclip = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case AssetExtension.material:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.material = data;
                                    drag.refreshAcceptables();
                                });
                                break;
                            case AssetExtension.geometry:
                                var path = this.data.path;
                                this.data.getData((data) =>
                                {
                                    dragsource.geometry = data;
                                    drag.refreshAcceptables();
                                });
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
                editorAssets.showFloder = this.data.path;
            } else if (this.data.extension == AssetExtension.scene)
            {
                this.data.getData((data: GameObject) =>
                {
                    var scene = data.getComponent(Scene3D);
                    scene.initCollectComponents();
                    engine.scene = scene;
                });
            } else if (this.data.extension == AssetExtension.ts
                || this.data.extension == AssetExtension.js
                || this.data.extension == AssetExtension.txt
            )
            {
                var url = `codeeditor.html?fstype=${assets.fstype}&DBname=${editorData.DBname}&project=${editorcache.projectname}&path=${this.data.path}&extension=${this.data.extension}`;
                url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                window.open(url);
            } else if (this.data.extension == AssetExtension.json
                || this.data.extension == AssetExtension.material
                || this.data.extension == AssetExtension.gameobject
                || this.data.extension == AssetExtension.geometry
                || this.data.extension == AssetExtension.anim
            )
            {
                var url = `codeeditor.html?fstype=${assets.fstype}&DBname=${editorData.DBname}&project=${editorcache.projectname}&path=${this.data.path}&extension=${AssetExtension.json}`;
                url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                window.open(url);
            }
        }

        private onclick()
        {
            editorData.selectObject(this.data);
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();
            editorAssets.popupmenu(this.data);
        }

        private onnameLabelclick()
        {
            if (this.data.selected)
            {
                this.renameInput.edit();
            }
        }

        private reanmeInputChange()
        {
            var newName = this.renameInput.text;
            this.data.rename(newName, this.dataChanged.bind(this));
        }
    }
}