namespace feng3d.editor
{
	export class MainView extends eui.Component implements eui.UIComponent
	{
		mainGroup: eui.Group;
		topGroup: eui.Group;
		mainButton: eui.Button;
		moveButton: eui.ToggleButton;
		rotateButton: eui.ToggleButton;
		scaleButton: eui.ToggleButton;
		helpButton: eui.Button;
		settingButton: eui.Button;
		hierachyGroup: eui.Group;
		assetsGroup: eui.Group;

		private watchers: eui.Watcher[] = [];

		constructor()
		{
			super();

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "MainViewSkin";
		}

		private onComplete(): void
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
			this.moveButton.addEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.rotateButton.addEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.scaleButton.addEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.helpButton.addEventListener(MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.settingButton.addEventListener(MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.mainButton.addEventListener(MouseEvent.CLICK, this.onMainButtonClick, this);

			//
			createObject3DView = createObject3DView || new CreateObject3DView();

			this.watchers.push(
				eui.Watcher.watch(editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this)
			);
		}

		private onRemovedFromStage()
		{
			this.moveButton.removeEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.rotateButton.removeEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.scaleButton.removeEventListener(MouseEvent.CLICK, this.onButtonClick, this);
			this.helpButton.removeEventListener(MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.settingButton.removeEventListener(MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.mainButton.removeEventListener(MouseEvent.CLICK, this.onMainButtonClick, this);

			while (this.watchers.length > 0)
			{
				this.watchers.pop().unwatch();
			}
		}

		private onMainButtonClick()
		{
			var globalPoint = this.mainButton.localToGlobal(0, 0);
			createObject3DView.showView(mainMenuConfig, this.onMainMenu.bind(this), globalPoint);
		}

		private onMainMenu(item: { label: string; command: string; })
		{
			$editorEventDispatcher.dispatch(<any>item.command);
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

	export var createObject3DView: CreateObject3DView;
}