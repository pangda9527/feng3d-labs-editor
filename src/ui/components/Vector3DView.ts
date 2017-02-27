module feng3d.editor
{
	export class Vector3DView extends eui.Component implements eui.UIComponent
	{
		public vm = new Vector3D(1, 2, 3);
		public xTextInput: eui.TextInput;
		public yTextInput: eui.TextInput;
		public zTextInput: eui.TextInput;

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "Vector3DViewSkin";
		}

		private onComplete()
		{
			this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
			this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
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
			}
		}
	}
}