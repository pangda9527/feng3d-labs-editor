namespace feng3d.editor
{
	@OAVComponent()
	export class OAVVector3D extends OAVBase
	{
		label: eui.Label;
		vector3DView: feng3d.editor.Vector3DView;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super(attributeViewInfo);
			this.skinName = "OAVVector3DSkin";
		}

		initView()
		{
			this.vector3DView.vm = <any>this.attributeValue;
			eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
		}

		dispose()
		{
			// this.vector3DView.vm = <any>this.attributeValue;
			// eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
		}
	}
}