export class Vector3DView extends eui.Component implements eui.UIComponent
{
	public group: eui.Group;
	public xTextInput: eui.TextInput;
	public yTextInput: eui.TextInput;
	public zTextInput: eui.TextInput;
	public wGroup: eui.Group;
	public wTextInput: eui.TextInput;

	get vm()
	{
		return this._vm;
	}
	set vm(v)
	{
		if (v)
			this._vm = v;
		else
			this._vm = new feng3d.Vector3(1, 2, 3);

		this.showw = v instanceof feng3d.Vector4;
		this.updateView();
	}
	private _vm: feng3d.Vector3 | feng3d.Vector4 = new feng3d.Vector3(1, 2, 3);

	constructor()
	{
		super();
		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "Vector3DViewSkin";
	}

	set showw(value)
	{
		if (this._showw == value)
			return;
		this._showw = value;
		this.skin.currentState = this._showw ? "showw" : "default";
	}
	private _showw = false;

	private onComplete()
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}
	}

	private onAddedToStage()
	{
		this.skin.currentState = this._showw ? "showw" : "default";
		this.updateView();

		[this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach((item) =>
		{
			this.addItemEventListener(item);
		});

	}

	private onRemovedFromStage()
	{
		[this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach((item) =>
		{
			this.removeItemEventListener(item);
		});
	}

	private addItemEventListener(input: eui.TextInput)
	{
		input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
		input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
		input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
	}

	private removeItemEventListener(input: eui.TextInput)
	{
		input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
		input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
		input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
	}

	private _textfocusintxt: boolean;
	private ontxtfocusin()
	{
		this._textfocusintxt = true;
	}

	private ontxtfocusout()
	{
		this._textfocusintxt = false;
		this.updateView();
	}

	updateView()
	{
		if (this._textfocusintxt) return;
		if (!this.xTextInput) return;
		this.xTextInput.text = "" + this.vm.x;
		this.yTextInput.text = "" + this.vm.y;
		this.zTextInput.text = "" + this.vm.z;
		if (this.vm instanceof feng3d.Vector4)
			this.wTextInput.text = "" + this.vm.w;
	}

	private onTextChange(event: egret.Event)
	{
		if (!this._textfocusintxt) return;

		switch (event.currentTarget)
		{
			case this.xTextInput:
				this.vm.x = Number(this.xTextInput.text);
				break;
			case this.yTextInput:
				this.vm.y = Number(this.yTextInput.text);
				break;
			case this.zTextInput:
				this.vm.z = Number(this.zTextInput.text);
				break;
			case this.wTextInput:
				if (this.vm instanceof feng3d.Vector4)
					this.wTextInput.text = "" + this.vm.w;
				break;
		}
	}
}