module feng3d.editor
{
	/**
	 * 默认对象属性界面
	 * @author feng 2016-3-10
	 */
	@OAVComponent()
	export class OAVDefault extends eui.Component implements IObjectAttributeView
	{
		private textTemp: string;
		private _space: Object;
		private _attributeName: string;
		private _attributeType: string;
		private attributeViewInfo: AttributeViewInfo;
		label: eui.Label;
		text: eui.TextInput;

		constructor(attributeViewInfo: AttributeViewInfo)
		{
			super();
			this._space = attributeViewInfo.owner;
			this._attributeName = attributeViewInfo.name;
			this._attributeType = attributeViewInfo.type;
			this.attributeViewInfo = attributeViewInfo;

			this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
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

		protected onComplete()
		{
			this.text.percentWidth = 100;
			this.label.text = this._attributeName;
			this.updateView();
		}

		$onAddToStage(stage: egret.Stage, nestLevel: number)
		{
			super.$onAddToStage(stage, nestLevel);
			this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
			this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

			if (this.attributeViewInfo.componentParam)
			{
				for (var key in this.attributeViewInfo.componentParam)
				{
					if (this.attributeViewInfo.componentParam.hasOwnProperty(key))
					{
						this[key] = this.attributeViewInfo.componentParam[key];
					}
				}
			}
		}

		$onRemoveFromStage()
		{
			super.$onRemoveFromStage()
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
			this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
			this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
			this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);

			drag.unregister(this);
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

		private onEnterFrame()
		{
			if (this._textfocusintxt)
				return;

			this.updateView();
		}

		get space(): Object
		{
			return this._space;
		}

		set space(value: Object)
		{
			this._space = value;
			this.updateView();
		}

		get attributeName(): string
		{
			return this._attributeName;
		}

		get attributeValue(): Object
		{
			return this._space[this._attributeName];
		}

		set attributeValue(value: Object)
		{
			if (this._space[this._attributeName] != value)
			{
				this._space[this._attributeName] = value;
			}
		}

		/**
		 * 更新界面
		 */
		updateView(): void
		{
			this.text.enabled = this.attributeViewInfo.writable;
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
				this.text.text = valuename + " (" + ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + ")";
				this.once(MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
			}
		}

		private onDoubleClick()
		{
			editor3DData.inspectorViewData.showData(this.attributeValue);
		}

		private onTextChange()
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
