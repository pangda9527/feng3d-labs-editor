module feng3d.editor
{
	export class MainView extends eui.Component implements eui.UIComponent
	{
		public mainGroup: eui.Group;
		public topGroup: eui.Group;
		public moveButton: eui.ToggleButton;
		public rotateButton: eui.ToggleButton;
		public scaleButton: eui.ToggleButton;
		public helpButton: eui.Button;
		public hierachyGroup: eui.Group;
		public assetsGroup: eui.Group;

		public constructor()
		{
			super();

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "MainViewSkin";
		}

		private onComplete(): void
		{
			this.helpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelpButtonClick, this);
			this.moveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
			this.rotateButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
			this.scaleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

			Watcher.watch(editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this);
		}

		private onHelpButtonClick()
		{
			window.open("index.md");
		}

		private onButtonClick(event: egret.TouchEvent)
		{
			switch (event.currentTarget)
			{
				case this.moveButton:
					editor3DData.object3DOperationID = 0;
					break;
				case this.rotateButton:
					editor3DData.object3DOperationID = 1;
					break;
				case this.scaleButton:
					editor3DData.object3DOperationID = 2;
					break;
			}
		}

		private onObject3DOperationIDChange()
		{
			this.moveButton.selected = editor3DData.object3DOperationID == 0;
			this.rotateButton.selected = editor3DData.object3DOperationID == 1;
			this.scaleButton.selected = editor3DData.object3DOperationID == 2;
		}
	}
}