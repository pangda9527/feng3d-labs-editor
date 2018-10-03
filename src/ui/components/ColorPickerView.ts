namespace editor
{
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
	/**
	 * editor.editorui.maskLayer.addChild(new editor.ColorPickerView())
	 * 
	 */
    export class ColorPickerView extends eui.Component
    {
        public group0: eui.Group;
        public image0: eui.Image;
        public pos0: eui.Group;
        public group1: eui.Group;
        public image1: eui.Image;
        public pos1: eui.Group;
        public txtR: eui.TextInput;
        public txtG: eui.TextInput;
        public txtB: eui.TextInput;
        public txtColor: eui.TextInput;


        //
        color = new feng3d.Color3(0.2, 0.5, 0);

        public constructor()
        {
            super();
            this.skinName = "ColorPickerView";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

            var w = this.group1.width - 4;
            var h = this.group1.height - 4;
            var imagedata1 = feng3d.imageUtil.createColorPickerStripe(w, h, colors, null, false);
            feng3d.dataTransform.imageDataToDataURL(imagedata1, dataurl =>
            {
                this.image1.source = dataurl;
            });
            this.updateView();
        }

        $onRemoveFromStage()
        {


            super.$onRemoveFromStage()
        }

        private updateView()
        {
            this.txtR.text = Math.round(this.color.r * 255).toString();
            this.txtG.text = Math.round(this.color.g * 255).toString();
            this.txtB.text = Math.round(this.color.b * 255).toString();
            this.txtColor.text = this.color.toHexString().substr(1);

            //
            var result = feng3d.imageUtil.getColorPickerRectPosition(this.color.toInt());
            var ratio = feng3d.imageUtil.getMixColorRatio(result.color.toInt(), colors);

            //
            var imagedata = feng3d.imageUtil.createColorPickerRect(result.color.toInt(), this.group0.width, this.group0.height);
            feng3d.dataTransform.imageDataToDataURL(imagedata, dataurl =>
            {
                this.image0.source = dataurl;
            });

            //
            this.pos0.x = result.ratioW * (this.group0.width - this.pos0.width);
            this.pos0.y = result.ratioH * (this.group0.height - this.pos0.height);

            this.pos1.y = ratio * (this.group0.height - this.pos0.height);
        }
    }
}