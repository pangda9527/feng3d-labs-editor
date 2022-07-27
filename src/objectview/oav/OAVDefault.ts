import { OAVComponent, AttributeViewInfo, watcher } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { DragDataMap, drag } from '../../ui/drag/Drag';
import { OAVBase } from './OAVBase';

/**
 * 默认对象属性界面
 */
@OAVComponent()
export class OAVDefault extends OAVBase
{
	declare public labelLab: eui.Label;
	public text: eui.TextInput;

	constructor(attributeViewInfo: AttributeViewInfo)
	{
		super(attributeViewInfo);

		this.skinName = 'OAVDefault';
	}

	// eslint-disable-next-line accessor-pairs
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
		{ watcher.watch(this.space, this.attributeName, this.updateView, this); }
	}

	dispose()
	{
		drag.unregister(this);

		if (this._attributeViewInfo.editable)
		{ watcher.unwatch(this.space, this.attributeName, this.updateView, this); }

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
		const value = this.attributeValue;
		if (value === undefined)
		{
			this.text.text = String(value);
		}
		else if (!(value instanceof Object))
		{
			this.text.text = String(value);
		}
		else
		{
			const valuename = value['name'] || '';
			this.text.text = `${valuename} (${value.constructor.name})`;
			this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
			this.text.enabled = false;
		}
	}

	private onDoubleClick()
	{
		EditorData.editorData.selectObject(this.attributeValue);
	}

	private onTextChange()
	{
		if (this._textfocusintxt)
		{
			switch (this._attributeType)
			{
				case 'String':
					this.attributeValue = this.text.text;
					break;
				case 'number':
					let num = Number(this.text.text);
					num = isNaN(num) ? 0 : num;
					this.attributeValue = num;
					break;
				case 'Boolean':
					this.attributeValue = Boolean(this.text.text);
					break;
				default:
					console.error(`无法处理类型${this._attributeType}!`);
			}
		}
	}
}
