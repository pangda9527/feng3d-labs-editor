namespace editor
{
    @feng3d.OAVComponent()
    export class OAVMinMaxCurveVector3 extends OAVBase
    {
        public labelLab: eui.Label;
        public minMaxCurveVector3View: editor.MinMaxCurveVector3View;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVMinMaxCurveVector3";
        }

        initView()
        {
            if (this._attributeViewInfo.editable)
            {
                this.minMaxCurveVector3View.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }

            this.minMaxCurveVector3View.minMaxCurveVector3 = this.attributeValue;

            this.minMaxCurveVector3View.touchEnabled = this.minMaxCurveVector3View.touchChildren = this._attributeViewInfo.editable;
        }

        dispose()
        {
            if (this._attributeViewInfo.editable)
            {
                this.minMaxCurveVector3View.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        }

        updateView()
        {

        }

        private onChange()
        {

        }
    }
}