namespace editor
{
	@feng3d.OVComponent()
	export class OVTransform extends eui.Component implements feng3d.IObjectView
	{
		//
		public xTextInput: eui.TextInput;
		public yTextInput: eui.TextInput;
		public zTextInput: eui.TextInput;
		public rxTextInput: eui.TextInput;
		public ryTextInput: eui.TextInput;
		public rzTextInput: eui.TextInput;
		public sxTextInput: eui.TextInput;
		public syTextInput: eui.TextInput;
		public szTextInput: eui.TextInput;
		//
		private _space: feng3d.Transform;
		private _objectViewInfo: feng3d.ObjectViewInfo;

		constructor(objectViewInfo: feng3d.ObjectViewInfo)
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

			[this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach((item) =>
			{
				this.addItemEventListener(item);
			});
		}

		private onRemovedFromStage()
		{
			this._space.off("transformChanged", this.updateView, this);
			//
			[this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach((item) =>
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

		private onTextChange(event: egret.Event)
		{
			if (!this._textfocusintxt) return;

			var transfrom: feng3d.Transform = <any>this.space;
			var value = 0;
			if (event.currentTarget.text != undefined)
			{
				value = Number(event.currentTarget.text);
				value = isNaN(value) ? 0 : value;
			}
			switch (event.currentTarget)
			{
				case this.xTextInput:
					transfrom.x = value;
					break;
				case this.yTextInput:
					transfrom.y = value;
					break;
				case this.zTextInput:
					transfrom.z = value;
					break;
				case this.rxTextInput:
					transfrom.rx = value;
					break;
				case this.ryTextInput:
					transfrom.ry = value;
					break;
				case this.rzTextInput:
					transfrom.rz = value;
					break;
				case this.sxTextInput:
					transfrom.sx = value ? value : 1;
					break;
				case this.syTextInput:
					transfrom.sy = value ? value : 1;
					break;
				case this.szTextInput:
					transfrom.sz = value ? value : 1;
					break;
			}
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
			if (this._textfocusintxt) return;
			var transfrom: feng3d.Transform = <any>this.space;
			if (!transfrom)
				return;
			this.xTextInput.text = "" + transfrom.x;
			this.yTextInput.text = "" + transfrom.y;
			this.zTextInput.text = "" + transfrom.z;
			this.rxTextInput.text = "" + transfrom.rx;
			this.ryTextInput.text = "" + transfrom.ry;
			this.rzTextInput.text = "" + transfrom.rz;
			this.sxTextInput.text = "" + transfrom.sx;
			this.syTextInput.text = "" + transfrom.sy;
			this.szTextInput.text = "" + transfrom.sz;
		}
	}
}