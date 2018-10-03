namespace editor
{

	/**
	 * editor.editorui.maskLayer.addChild(new editor.ColorPickerView())
	 * 
	 */
    export class ColorPickerView extends eui.Component
    {
        public rect0: eui.Rect;
        public rect1: eui.Rect;
        public txtR: eui.TextInput;
        public txtG: eui.TextInput;
        public txtB: eui.TextInput;
        public txtColor: eui.TextInput;

        //
        color = new feng3d.Color3(1, 0, 0);

        public constructor()
        {
            super();
            this.skinName = "ColorPickerView";
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number)
        {
            super.$onAddToStage(stage, nestLevel);

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
        }
    }
}