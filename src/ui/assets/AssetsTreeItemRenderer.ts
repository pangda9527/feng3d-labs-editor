module feng3d.editor
{
    export class AssetsTreeItemRenderer extends TreeItemRenderer
    {
        public namelabel: eui.Label;
        public nameeditTxt: eui.TextInput;

        data: AssetsTreeNode;

        constructor()
        {
            super();
            this.skinName = "AssetsTreeItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.namelabel.addEventListener(MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.namelabel.removeEventListener(MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                var accepttypes = [];
                drag.register(this, (dragsource) =>
                {
                    dragsource.file = this.data.fileinfo.path;
                }, ["file"], (dragdata) =>
                    {
                        var filepath = dragdata.file;
                        var dest = this.data.fileinfo.path + "/" + filepath.split("/").pop();
                        assets.move(filepath, dest);
                    });
            } else
            {
                drag.unregister(this);
            }
        }
        private onclick()
        {
            assets.showFloder = this.data.fileinfo.path;
        }

        private onrightclick(e)
        {
            assets.popupmenu(this.data.fileinfo);
        }

        private onnameLabelclick()
        {
            if (this.data == assetstree.rootnode)
                return;

            if (this.data.selected && !input.rightmouse)
            {
                this.nameeditTxt.text = this.namelabel.text;
                this.namelabel.visible = false;
                this.nameeditTxt.visible = true;
                this.nameeditTxt.textDisplay.setFocus();

                this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
            }
        }

        private onnameeditend()
        {
            this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
            this.nameeditTxt.visible = false;
            this.namelabel.visible = true;
            if (this.nameeditTxt.text == this.namelabel.text)
                return;
            var newpath = this.data.fileinfo.path.replace(this.namelabel.text, this.nameeditTxt.text);
            assets.rename(this.data.fileinfo.path, newpath);
        }
    }
}