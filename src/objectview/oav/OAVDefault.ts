namespace feng3d.editor
{
	/**
	 * 默认对象属性界面
	 * @author feng 2016-3-10
	 */
	@OAVComponent()
	export class OAVDefault extends OAVBase
	{
		public label: eui.Label;
		public text: eui.TextInput;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super(attributeViewInfo);

			this.skinName = "OAVDefault";
		}

		set dragparam(param: { accepttype: keyof DragData; datatype: string; })
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

		private _textEnabled: undefined | boolean = undefined;
		set textEnabled(v: boolean)
		{
			this.text.enabled = v;
			this._textEnabled = v;
		}

		initView()
		{
			this.text.percentWidth = 100;
			this.label.text = this._attributeName;

			this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

			watcher.watch(this.space, this.attributeName, this.updateView, this);
		}

		dispose()
		{
			drag.unregister(this);
			watcher.unwatch(this.space, this.attributeName, this.updateView, this);

			this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
		}

		private _textfocusintxt: boolean;
		private ontxtfocusin()
		{
			this._textfocusintxt = true;
		}

		private ontxtfocusout()
		{
			this._textfocusintxt = false;
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.text.enabled = this.attributeViewInfo.writable;
			var value = this.attributeValue;
			if (this.attributeValue === undefined)
			{
				this.text.text = String(this.attributeValue);
			} else if (!(this.attributeValue instanceof Object))
			{
				this.text.text = String(this.attributeValue);
			} else
			{
				this.text.enabled = false;
				var valuename = this.attributeValue["name"] || "";
				this.text.text = valuename + " (" + this.attributeValue.constructor.name + ")";
				this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
			}
			if (this._textEnabled !== undefined)
				this.text.enabled = this._textEnabled;
		}

		private onDoubleClick()
		{
			editorui.inspectorView.showData(this.attributeValue);
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
						throw `无法处理类型${this._attributeType}!`;
				}
			}
		}
	}
}
