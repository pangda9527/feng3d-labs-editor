namespace feng3d.editor
{
    export class AssetsFileItemRenderer extends eui.ItemRenderer
    {
        public icon: eui.Image;
        public nameLabel: eui.Label;
        public nameeditTxt: eui.TextInput;

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
            this.nameLabel.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            this.nameeditTxt.textDisplay.textAlign = egret.HorizontalAlign.CENTER;
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            this.nameLabel.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                var accepttypes = [];
                if (this.data.isDirectory)
                {
                    drag.register(this, (dragsource) =>
                    {
                        this.data.setDragSource(dragsource);
                    }, ["file"], (dragdata) =>
                        {
                            var movefile = assets.getFile(dragdata.file);
                            movefile.move(this.data.path);
                        });
                }
                else
                {
                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.path.split(".").pop();
                        if (extension == "gameobject")
                        {
                            dragsource.file_gameobject = this.data.path;
                        }
                        if (extension == "ts")
                        {
                            dragsource.file_script = this.data.path;
                        }
                        if (extension == "anim")
                        {
                            var path = this.data.path;
                            Loader.loadText(path, (content) =>
                            {
                                var animationclip = serialization.deserialize(JSON.parse(content));
                                dragsource.animationclip = animationclip;
                                drag.refreshAcceptables();
                            });
                        }
                        if (extension == "material")
                        {
                            var path = this.data.path;
                            Loader.loadText(path, (content) =>
                            {
                                var material = serialization.deserialize(JSON.parse(content));
                                dragsource.material = material;
                                drag.refreshAcceptables();
                            });
                        }
                        if (extension == "geometry")
                        {
                            var path = this.data.path;
                            Loader.loadText(path, (content) =>
                            {
                                var geometry = serialization.deserialize(JSON.parse(content));
                                dragsource.geometry = geometry;
                                drag.refreshAcceptables();
                            });
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
                assets.showFloder = this.data.path;
            }
        }

        private onclick()
        {
            editorData.selectObject(this.data);
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();
            assets.popupmenu(this.data);
        }

        private onnameLabelclick()
        {
            if (this.data.selected)
            {
                this.nameeditTxt.text = this.nameLabel.text;
                this.nameLabel.visible = false;
                this.nameeditTxt.visible = true;
                this.nameeditTxt.textDisplay.setFocus();

                this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
            }
        }

        private onnameeditend()
        {
            this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
            this.nameeditTxt.visible = false;
            this.nameLabel.visible = true;
            if (this.nameLabel.text == this.nameeditTxt.text)
                return;
            var newName = this.data.name.replace(this.nameLabel.text, this.nameeditTxt.text);
            this.data.rename(newName);
        }
    }
}