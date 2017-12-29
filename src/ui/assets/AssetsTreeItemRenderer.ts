namespace feng3d.editor
{
    export class AssetsTreeItemRenderer extends TreeItemRenderer
    {
        public namelabel: eui.Label;
        public nameeditTxt: eui.TextInput;

        data: AssetsFile;

        constructor()
        {
            super();
            this.skinName = "AssetsTreeItemRenderer";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.namelabel.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        $onRemoveFromStage()
        {
            super.$onRemoveFromStage();
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

            this.namelabel.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
        }

        dataChanged()
        {
            super.dataChanged();

            if (this.data)
            {
                var accepttypes = [];
                drag.register(this, (dragsource) =>
                {
                    dragsource.file = this.data.path;
                }, ["file"], (dragdata) =>
                    {
                        var movefile = editorAssets.getFile(dragdata.file);
                        movefile.move(this.data.path);
                    });
            } else
            {
                drag.unregister(this);
            }
        }
        private onclick()
        {
            editorAssets.showFloder = this.data.path;
        }

        private onrightclick(e)
        {
            editorAssets.popupmenu(this.data);
        }

        private onnameLabelclick()
        {
            if (this.data.parent == null)
                return;

            if (this.data.selected && !windowEventProxy.rightmouse)
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
            var newName = this.data.name.replace(this.namelabel.text, this.nameeditTxt.text);
            this.data.rename(newName);
        }
    }
}