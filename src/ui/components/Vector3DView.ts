module feng3d.editor
{
	export class Vector3DView extends eui.Component implements eui.UIComponent
	{
		vm = new Vector3D(1, 2, 3);

		public group: eui.Group;
		public xTextInput: eui.TextInput;
		public yTextInput: eui.TextInput;
		public zTextInput: eui.TextInput;
		public wGroup: eui.Group;
		public wTextInput: eui.TextInput;

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

			this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.wTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private onRemovedFromStage()
		{
			this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.wTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private onTextChange(event: egret.Event)
		{
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
					this.vm.w = Number(this.wTextInput.text);
					break;
			}
		}
	}
}