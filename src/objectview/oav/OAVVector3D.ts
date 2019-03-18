import { OAVBase } from "./OAVBase";
import { Vector3DView } from "../../ui/components/Vector3DView";

@feng3d.OAVComponent()
export class OAVVector3D extends OAVBase
{
	labelLab: eui.Label;
	vector3DView: Vector3DView;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
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