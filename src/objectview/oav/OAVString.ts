namespace editor
{
    @feng3d.OAVComponent()
    export class OAVString extends OAVBase
    {
        public txtInput: eui.TextInput;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVString";
        }

        initView()
        {
            this.txtInput.enabled = this._attributeViewInfo.editable;
            feng3d.watcher.watch(this.space, this._attributeName, this.updateView, this);
            this.txtInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        dispose()
        {
            feng3d.watcher.unwatch(this.space, this._attributeName, this.updateView, this);
            this.txtInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        updateView()
        {
            this.txtInput.text = this.attributeValue;
        }

        private onTextChange()
        {
            this.attributeValue = this.txtInput.text;
        }
    }
}