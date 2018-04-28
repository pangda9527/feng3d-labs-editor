
/**
 * 重命名组件
 */
class RenameTextInput extends eui.Component implements eui.UIComponent
{
	public nameeditTxt: eui.TextInput;
	public nameLabel: eui.Label;

	/**
	 * 显示文本
	 */
	get text()
	{
		return this.nameLabel.text;
	}
	set text(v)
	{
		this.nameLabel.text = v;
	}

	public constructor()
	{
		super();
		this.skinName = "RenameTextInputSkin";
	}

	/**
	 * 启动编辑
	 */
	edit()
	{
		this.nameeditTxt.textDisplay.textAlign = egret.HorizontalAlign.CENTER;
		this.nameeditTxt.text = this.nameLabel.text;
		this.nameLabel.visible = false;
		this.nameeditTxt.visible = true;
		this.nameeditTxt.textDisplay.setFocus();
		//
		this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
		feng3d.windowEventProxy.on("keyup", this.onnameeditChanged, this);
	}

	/**
	 * 取消编辑
	 */
	cancelEdit()
	{
		this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
		feng3d.windowEventProxy.off("keyup", this.onnameeditChanged, this);
		//
		this.nameeditTxt.visible = false;
		this.nameLabel.visible = true;
		if (this.nameLabel.text == this.nameeditTxt.text)
			return;
		this.nameLabel.text = this.nameeditTxt.text
		this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
	}

	private onnameeditChanged()
	{
		if (feng3d.windowEventProxy.key == "Enter" || feng3d.windowEventProxy.key == "Escape")
		{
			this.nameeditTxt.textDisplay.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT));
		}
	}

}