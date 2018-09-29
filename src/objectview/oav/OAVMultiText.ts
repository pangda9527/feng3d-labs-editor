namespace editor
{
	/**
	 * 默认对象属性界面
	 */
    @feng3d.OAVComponent()
    export class OAVMultiText extends OAVBase
    {
        public multiText: eui.Label;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);
            this.skinName = "OAVMultiText";
        }

        initView()
        {
            this.multiText.text = this.attributeValue;
        }
    }
}