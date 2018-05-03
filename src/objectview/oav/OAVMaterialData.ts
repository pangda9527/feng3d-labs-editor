namespace feng3d.editor
{
    @OAVComponent()
    export class OAVMaterialData extends OAVBase
    {
        //
        space: Material;

        constructor(attributeViewInfo: AttributeViewInfo)
        {
            super(attributeViewInfo);

            // this.skinName = "OVMaterial";
        }

        protected onComplete(): void
        {
            super.onComplete();
            this.initView();
            this.updateView();
        }

        initView()
        {
            
        }

        updateView()
        {
            var uniforms = this.attributeValue;



        }
    }
}