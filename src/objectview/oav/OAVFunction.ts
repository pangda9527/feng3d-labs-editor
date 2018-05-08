namespace feng3d.editor
{
    @OAVComponent()
    export class OAVFunction extends OAVBase
    {
        public label: eui.Label;
        public button: eui.Button;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVFunction";
        }

        initView()
        {
            this.button.addEventListener(egret.MouseEvent.CLICK, this.click, this);
        }

        dispose()
        {
            this.button.removeEventListener(egret.MouseEvent.CLICK, this.click, this);
        }

        updateView()
        {

        }

        protected click(event: egret.Event)
        {
            this._space[this._attributeName]();
        }
    }
}