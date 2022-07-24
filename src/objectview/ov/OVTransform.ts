import { OVComponent, IObjectView, Transform, ObjectViewInfo } from 'feng3d';
import { NumberTextInputBinder } from '../../ui/components/binders/NumberTextInputBinder';

@OVComponent()
export class OVTransform extends eui.Component implements IObjectView
{
	//
	public xLabel: eui.Label;
	public xTextInput: eui.TextInput;
	public yLabel: eui.Label;
	public yTextInput: eui.TextInput;
	public zLabel: eui.Label;
	public zTextInput: eui.TextInput;
	public rxLabel: eui.Label;
	public rxTextInput: eui.TextInput;
	public ryLabel: eui.Label;
	public ryTextInput: eui.TextInput;
	public rzLabel: eui.Label;
	public rzTextInput: eui.TextInput;
	public sxLabel: eui.Label;
	public sxTextInput: eui.TextInput;
	public syLabel: eui.Label;
	public syTextInput: eui.TextInput;
	public szLabel: eui.Label;
	public szTextInput: eui.TextInput;

	//
	private _space: Transform;
	private _objectViewInfo: ObjectViewInfo;

	constructor(objectViewInfo: ObjectViewInfo)
	{
		super();
		this._objectViewInfo = objectViewInfo;
		this._space = <any>objectViewInfo.owner;

		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "OVTransform";
	}

	private onComplete()
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}

		this.updateView();
	}

	private onAddedToStage()
	{
		this._space.on("transformChanged", this.updateView, this);
		//
		this.updateView();

		["x", "y", "z", "sx", "sy", "sz"].forEach(v =>
		{
			this.addBinder(new NumberTextInputBinder().init({
				space: this.space, attribute: v, textInput: this[v + "TextInput"], editable: true,
				controller: this[v + "Label"],
			}));
		});
		["rx", "ry", "rz"].forEach(v =>
		{
			this.addBinder(new NumberTextInputBinder().init({
				space: this.space, attribute: v, textInput: this[v + "TextInput"], editable: true,
				controller: this[v + "Label"], step: 0.1,
			}));
		});


	}

	private onRemovedFromStage()
	{
		this._space.off("transformChanged", this.updateView, this);
		//
	}

	get space()
	{
		return this._space;
	}

	set space(value)
	{
		if (this._space)
			this._space.off("transformChanged", this.updateView, this);
		this._space = value;
		if (this._space)
			this._space.on("transformChanged", this.updateView, this);
		this.updateView();
	}

	getAttributeView(attributeName: String)
	{
		return null;
	}

	getblockView(blockName: String)
	{
		return null;
	}
	/**
	 * 更新界面
	 */
	updateView(): void
	{
		var transform: Transform = <any>this.space;
		if (!transform)
			return;
	}
}
