module feng3d.editor
{
	export class Accordion extends eui.Component implements eui.UIComponent
	{
		public group: eui.Group;
		public titleGroup: eui.Group;
		public titleButton: eui.Button;
		public contentGroup: eui.Group;

		private components: eui.Component[] = [];
		public titleName = "";

		public constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "AccordionSkin";
		}

		public addContent(component: eui.Component)
		{
			if (!this.contentGroup)
				this.components.push(component);
			else
				this.contentGroup.addChild(component);
		}

		private onComplete()
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

		private onTitleButtonClick()
		{
			this.currentState = this.currentState == "hide" ? "show" : "hide";
		}
	}
}