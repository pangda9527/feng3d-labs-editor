namespace editor
{
	/**
	 * 默认对象属性界面
	 */
    @feng3d.OAVComponent()
    export class OAVMultiText extends OAVBase
    {
        public txtLab: eui.Label;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVMultiText";
        }

        initView()
        {
            feng3d.watcher.watch(this.space, this._attributeName, this.updateView, this);
        }

        dispose()
        {
            feng3d.watcher.unwatch(this.space, this._attributeName, this.updateView, this);
        }

        updateView()
        {
            this.txtLab.text = this.attributeValue;
        }
    }
}