import { editorui } from '../global/editorui';

export class MainView extends eui.Component implements eui.UIComponent
{
	constructor()
	{
		super();

		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'MainViewSkin';
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
		window.addEventListener('resize', this.onresize.bind(this));
		this.onresize();
	}

	private onRemovedFromStage()
	{
		window.removeEventListener('resize', this.onresize.bind(this));
	}

	private onresize()
	{
		this.stage.setContentSize(window.innerWidth, window.innerHeight);

		editorui.mainview.width = this.stage.stageWidth;
		editorui.mainview.height = this.stage.stageHeight;
	}
}
