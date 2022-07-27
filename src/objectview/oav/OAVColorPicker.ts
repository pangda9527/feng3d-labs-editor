import { Color3, Color4, OAVComponent, AttributeViewInfo } from 'feng3d';
import { ColorPicker } from '../../ui/components/ColorPicker';
import { OAVBase } from './OAVBase';

export interface OAVColorPicker
{
    get attributeValue(): Color3 | Color4;
    set attributeValue(v);
}

@OAVComponent()
export class OAVColorPicker extends OAVBase
{
declare public labelLab: eui.Label;
    public colorPicker: ColorPicker;
    public input: eui.TextInput;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = 'OAVColorPicker';
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
        {
            this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        this.colorPicker.touchEnabled = this.colorPicker.touchChildren = this.input.enabled = this._attributeViewInfo.editable;
    }

    dispose()
    {
        this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
    }

    updateView()
    {
        const color = this.attributeValue;
        this.colorPicker.value = color;
        this.input.text = color.toHexString();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onChange(event: egret.Event)
    {
        //
        this.attributeValue = this.colorPicker.value.clone();
        this.input.text = this.attributeValue.toHexString();
    }

    private _textfocusintxt: boolean;
    private ontxtfocusin()
    {
        this._textfocusintxt = true;
    }

    private ontxtfocusout()
    {
        this._textfocusintxt = false;
        this.input.text = this.attributeValue.toHexString();
    }

    private onTextChange()
    {
        if (this._textfocusintxt)
        {
            const text = this.input.text;
            if (this.attributeValue instanceof Color3)
            {
                this.colorPicker.value = new Color3().fromUnit(Number(`0x${text.substr(1)}`));
                this.attributeValue = new Color3().fromUnit(Number(`0x${text.substr(1)}`));
            }
 else
            {
                this.colorPicker.value = new Color4().fromUnit(Number(`0x${text.substr(1)}`));
                this.attributeValue = new Color4().fromUnit(Number(`0x${text.substr(1)}`));
            }
        }
    }
}
