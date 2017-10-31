module feng3d.editor
{
    export class AssetsFileItemRenderer extends eui.ItemRenderer
    {
        public icon: eui.Image;
        public nameLabel: eui.Label;
        public nameeditTxt: eui.TextInput;

        data: AssetsFileNode;

        constructor()
        {
            super();
            this.skinName = "AssetsFileItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.addEventListener(MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            this.nameLabel.addEventListener(MouseEvent.CLICK, this.onnameLabelclick, this);
            this.nameeditTxt.textDisplay.textAlign = egret.HorizontalAlign.CENTER;
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            this.nameLabel.removeEventListener(MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                var accepttypes = [];
                if (this.data.fileinfo.isDirectory)
                {
                    drag.register(this, (dragsource) =>
                    {
                        if (this.data.fileinfo.path.split(".").pop() == "gameobject")
                        {
                            dragsource.file_gameobject = this.data.fileinfo.path;
                        }
                        dragsource.file = this.data.fileinfo.path;
                    }, ["file"], (dragdata) =>
                        {
                            var filepath = dragdata.file;
                            var dest = this.data.fileinfo.path + "/" + filepath.split("/").pop();
                            assets.move(filepath, dest);
                        });
                }
                else
                {
                    drag.register(this, (dragsource) =>
                    {
                        var extension = this.data.fileinfo.path.split(".").pop();
                        if (extension == "gameobject")
                        {
                            dragsource.file_gameobject = this.data.fileinfo.path;
                        }
                        if (extension == "ts")
                        {
                            dragsource.file_script = this.data.fileinfo.path;
                        }
                        if (extension == "anim")
                        {
                            var path = this.data.fileinfo.path;
                            Loader.loadText(path, (content) =>
                            {
                                var animationclip = serialization.deserialize(JSON.parse(content));
                                dragsource.animationclip = animationclip;
                                drag.refreshAcceptables();
                            });
                        }
                        dragsource.file = this.data.fileinfo.path;
                    }, []);
                }
            } else
            {
                drag.unregister(this);
            }
        }

        private ondoubleclick()
        {
            if (this.data.fileinfo.isDirectory)
            {
                assets.showFloder = this.data.fileinfo.path;
            }
        }

        private onclick()
        {
            editor3DData.selectedObject = this.data.fileinfo;
        }

        private onrightclick(e: egret.Event)
        {
            e.stopPropagation();
            assets.popupmenu(this.data.fileinfo);
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
            var newpath = this.data.fileinfo.path.replace(this.nameLabel.text, this.nameeditTxt.text);
            assets.rename(this.data.fileinfo.path, newpath);
        }
    }
}