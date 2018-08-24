namespace editor
{
	export class Accordion extends eui.Component implements eui.UIComponent
	{
		public titleGroup: eui.Group;
		public titleLabel: eui.Label;
		public contentGroup: eui.Group;

		/**
		 * 标签名称
		 */
		titleName = "";

		private components: eui.Component[] = [];

		constructor()
		{
			super();
			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "Accordion";
		}

		addContent(component: eui.Component)
		{
			if (!this.contentGroup)
				this.components.push(component);
			else
				this.contentGroup.addChild(component);
		}

		removeContent(component: eui.Component)
		{
			var index = this.components ? this.components.indexOf(component) : -1;
			if (index != -1)
				this.components.splice(index, 1);
			else
				component.parent && component.parent.removeChild(component);
		}

		protected onComplete()
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

			if (this.stage)
			{
				this.onAddedToStage();
			}
		}

		protected onAddedToStage()
		{
			this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
			this.titleLabel.text = this.titleName;
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

		protected onRemovedFromStage()
		{
			this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
		}

		private onTitleButtonClick()
		{
			this.currentState = this.currentState == "hide" ? "show" : "hide";
		}
	}
}