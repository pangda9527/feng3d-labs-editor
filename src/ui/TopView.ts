namespace editor
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
		public qrcodeButton: eui.Button;
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
			this.qrcodeButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

			feng3d.feng3dDispatcher.on("editor.toolTypeChanged", this.updateview, this);

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
			this.qrcodeButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);

			feng3d.feng3dDispatcher.off("editor.toolTypeChanged", this.updateview, this);

			if (runwin) runwin.close();
			runwin = null;
		}

		private onMainMenu(item: { label: string; command: string; })
		{
			feng3d.feng3dDispatcher.dispatch(<any>item.command);
		}

		private onHelpButtonClick()
		{
			window.open("http://feng3d.com");
		}

		private onButtonClick(event: egret.TouchEvent)
		{
			switch (event.currentTarget)
			{
				case this.mainButton:
					menu.popup(mainMenu);
					break;
				case this.moveButton:
					editorData.toolType = MRSToolType.MOVE;
					break;
				case this.rotateButton:
					editorData.toolType = MRSToolType.ROTATION;
					break;
				case this.scaleButton:
					editorData.toolType = MRSToolType.SCALE;
					break;
				case this.worldButton:
					editorData.isWoldCoordinate = !editorData.isWoldCoordinate;
					break;
				case this.centerButton:
					editorData.isBaryCenter = !editorData.isBaryCenter;
					break;
				case this.playBtn:
					editorui.inspectorView.saveShowData(() =>
					{
						editorFS.fs.writeObject("default.scene.json", engine.scene.gameObject, (err) =>
						{
							if (err)
							{
								feng3d.warn(err);
								return;
							}
							if (editorFS.fs.type == feng3d.FSType.indexedDB)
							{
								if (runwin) runwin.close();
								runwin = window.open(`run.html?fstype=${feng3d.fs.type}&project=${editorcache.projectname}`);
								return;
							}
							editorFS.fs.getAbsolutePath("index.html", (err, path) =>
							{
								if (err)
								{
									feng3d.warn(err);
									return;
								}
								if (runwin) runwin.close();
								runwin = window.open(path);
							});
						});
					});
					break;
				case this.qrcodeButton:
					setTimeout(() =>
					{
						$('#output').show();
					}, 10);
					break;
			}
		}

		private updateview()
		{
			this.moveButton.selected = editorData.toolType == MRSToolType.MOVE;
			this.rotateButton.selected = editorData.toolType == MRSToolType.ROTATION;
			this.scaleButton.selected = editorData.toolType == MRSToolType.SCALE;
			this.worldButton.selected = !editorData.isWoldCoordinate;
			this.centerButton.selected = editorData.isBaryCenter;
		}
	}
	// 运行窗口
	export var runwin: Window;
}