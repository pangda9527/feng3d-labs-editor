namespace feng3d.editor
{
	@OVComponent()
	export class OVTransform extends eui.Component implements IObjectView
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
			this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.rxTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.ryTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.rzTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.sxTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.syTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.szTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private onRemovedFromStage()
		{
			this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.rxTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.ryTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.rzTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.sxTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.syTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.szTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private onTextChange(event: egret.Event)
		{
			var transfrom: Transform = <any>this.space;
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

		getAttributeView(attributeName: String): IObjectAttributeView
		{
			return null;
		}

		getblockView(blockName: String): IObjectBlockView
		{
			return null;
		}
		/**
		 * 更新界面
		 */
		updateView(): void
		{
			var transfrom: Transform = <any>this.space;
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