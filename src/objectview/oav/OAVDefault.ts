namespace editor
{
	/**
	 * 默认对象属性界面
	 */
	@feng3d.OAVComponent()
	export class OAVDefault extends OAVBase
	{
		public labelLab: eui.Label;
		public text: eui.TextInput;

		constructor(attributeViewInfo: feng3d.AttributeViewInfo)
		{
			super(attributeViewInfo);

			this.skinName = "OAVDefault";
		}

		set dragparam(param: { accepttype: keyof DragDataMap; datatype: string; })
		{
			if (param)
			{
				//
				drag.register(this,
					(dragsource) =>
					{
						if (param.datatype) dragsource[param.datatype] = this.attributeValue;
					},
					[param.accepttype],
					(dragSource) =>
					{
						this.attributeValue = dragSource[param.accepttype];
					});
			}
		}

		initView()
		{
			this.text.percentWidth = 100;

			this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

			if (this._attributeViewInfo.editable)
				feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
		}

		dispose()
		{
			drag.unregister(this);

			if (this._attributeViewInfo.editable)
				feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);

			this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private _textfocusintxt: boolean;
		protected ontxtfocusin()
		{
			this._textfocusintxt = true;
		}

		protected ontxtfocusout()
		{
			this._textfocusintxt = false;
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.text.enabled = this._attributeViewInfo.editable;
			var value = this.attributeValue;
			if (value === undefined)
			{
				this.text.text = String(value);
			} else if (!(value instanceof Object))
			{
				this.text.text = String(value);
			} else
			{
				var valuename = value["name"] || "";
				this.text.text = valuename + " (" + value.constructor.name + ")";
				this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
				this.text.enabled = false;
			}
		}

		private onDoubleClick()
		{
			feng3d.dispatcher.dispatch("inspector.showData", this.attributeValue);
		}

		private onTextChange()
		{
			if (this._textfocusintxt)
			{
				switch (this._attributeType)
				{
					case "String":
						this.attributeValue = this.text.text;
						break;
					case "number":
						var num = Number(this.text.text);
						num = isNaN(num) ? 0 : num;
						this.attributeValue = num;
						break;
					case "Boolean":
						this.attributeValue = Boolean(this.text.text);
						break;
					default:
						console.error(`无法处理类型${this._attributeType}!`);
				}
			}
		}
	}
}
