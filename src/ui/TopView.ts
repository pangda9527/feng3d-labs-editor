namespace feng3d.editor
{
	export class TopView extends eui.Component implements eui.UIComponent
	{
		public topGroup: eui.Group;
		public mainButton: eui.Button;
		public moveButton: eui.ToggleButton;
		public rotateButton: eui.ToggleButton;
		public scaleButton: eui.ToggleButton;
		public worldButton: eui.ToggleButton;
		public centerButton: eui.ToggleButton;
		public helpButton: eui.Button;
		public settingButton: eui.Button;
		public playBtn: eui.Button;

		constructor()
		{
			super();

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "TopView";
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
			this.mainButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

			this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);

			watcher.watch(mrsTool, "toolType", this.updateview, this);

			this.updateview();
		}

		private onRemovedFromStage()
		{
			this.mainButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
			this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

			this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
			this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);

			watcher.unwatch(mrsTool, "toolType", this.updateview, this);
		}

		private onMainMenu(item: { label: string; command: string; })
		{
			editorDispatcher.dispatch(<any>item.command);
		}

		private onHelpButtonClick()
		{
			var url = "index.md";
			// var url = "codeeditor.html";
			url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
			window.open(url);
		}

		private onButtonClick(event: egret.TouchEvent)
		{
			switch (event.currentTarget)
			{
				case this.mainButton:
					menu.popup(mainMenu);
					break;
				case this.moveButton:
					mrsTool.toolType = MRSToolType.MOVE;
					break;
				case this.rotateButton:
					mrsTool.toolType = MRSToolType.ROTATION;
					break;
				case this.scaleButton:
					mrsTool.toolType = MRSToolType.SCALE;
					break;
				case this.worldButton:
					mrsTool.isWoldCoordinate = !mrsTool.isWoldCoordinate;
					break;
				case this.centerButton:
					mrsTool.isBaryCenter = !mrsTool.isBaryCenter;
					break;
				case this.playBtn:
					editorAssets.saveScene("default.scene", engine.scene, (err) =>
					{
						if (err)
						{
							warn(err);
							return;
						}
						if (fs == indexedDBfs)
						{
							window.open(`run.html?fstype=${fstype}&DBname=${editorData.DBname}&project=${editorAssets.projectPath}`);
							return;
						}
						fs.getAbsolutePath("index.html", (err, path) =>
						{
							if (err)
							{
								warn(err);
								return;
							}
							window.open(path);
						});
					});
					break;
			}
		}

		private updateview()
		{
			this.moveButton.selected = mrsTool.toolType == MRSToolType.MOVE;
			this.rotateButton.selected = mrsTool.toolType == MRSToolType.ROTATION;
			this.scaleButton.selected = mrsTool.toolType == MRSToolType.SCALE;
			this.worldButton.selected = mrsTool.isWoldCoordinate;
			this.centerButton.selected = mrsTool.isBaryCenter;
		}
	}
}