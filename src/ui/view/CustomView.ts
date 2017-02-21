module feng3d.editor
{
	export class CustomView extends eui.Component implements eui.UIComponent
	{

		public xx: eui.CheckBox;
		public aa: eui.Button;
		public jj: eui.EditableText;
		public ss: eui.TextInput;
		public dd: eui.ToggleSwitch;
		public zz: eui.ToggleButton;


		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			// this.skinName = "CustomViewSkin";
			this.skinName = "resource/eui_skins/CustomView.exml";
		}

		protected partAdded(partName: string, instance: any): void
		{
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void
		{
			super.childrenCreated();
		}

		private onComplete(): void
		{
			console.log("onComplete");
		}
	}
}