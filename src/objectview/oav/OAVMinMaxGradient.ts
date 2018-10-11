namespace editor
{
    @feng3d.OAVComponent()
    export class OAVMinMaxGradient extends OAVBase
    {
        public labelLab: eui.Label;
        public minMaxGradientView: editor.MinMaxGradientView;

        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
        {
            super(attributeViewInfo);

            this.skinName = "OAVMinMaxGradient";
        }

        initView()
        {

        }

        dispose()
        {
        }

        updateView()
        {

        }

    }
}