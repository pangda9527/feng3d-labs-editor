module feng3d.editor
{
	export class Accordion extends eui.Component implements eui.UIComponent
	{
		group: eui.Group;
		titleGroup: eui.Group;
		titleButton: eui.Button;
		contentGroup: eui.Group;

		private components: eui.Component[] = [];
		titleName = "";

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "AccordionSkin";
		}

		addContent(component: eui.Component)
		{
			if (!this.contentGroup)
				this.components.push(component);
			else
				this.contentGroup.addChild(component);
		}

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
			this.titleButton.addEventListener(MouseEvent.CLICK, this.onTitleButtonClick, this);
			if (this.components)
			{
				for (var i = 0; i < this.components.length; i++)
				{
					this.contentGroup.addChild(this.components[i]);
				}
				this.components = null;
				delete this.components;
			}
		}

		private onRemovedFromStage()
		{
			this.titleButton.removeEventListener(MouseEvent.CLICK, this.onTitleButtonClick, this);
		}

		private onTitleButtonClick()
		{
			this.currentState = this.currentState == "hide" ? "show" : "hide";
		}
	}
}