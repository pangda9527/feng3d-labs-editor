import { GameObject, OAVComponent, AttributeViewInfo } from 'feng3d';
import { OAVBase } from './OAVBase';

export interface OAVGameObjectName
{
    get space(): GameObject;
}

@OAVComponent()
export class OAVGameObjectName extends OAVBase
{
    public nameInput: eui.TextInput;
    public visibleCB: eui.CheckBox;
    public mouseEnabledCB: eui.CheckBox;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = 'OAVGameObjectName';
    }

    initView()
    {
        this.visibleCB.addEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
        this.mouseEnabledCB.addEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);

        this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.nameInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
    }

    dispose()
    {
        this.visibleCB.removeEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
        this.mouseEnabledCB.removeEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);

        this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
        this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        this.nameInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
    }

    updateView()
    {
        this.visibleCB.selected = this.space.activeSelf;
        this.mouseEnabledCB.selected = this.space.mouseEnabled;
        this.nameInput.text = this.space.name;
    }

    private onVisibleCBClick()
    {
        this.space.activeSelf = !this.space.activeSelf;
    }

    private onMouseEnabledCBClick()
    {
        this.space.mouseEnabled = !this.space.mouseEnabled;
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

    private onTextChange()
    {
        if (this._textfocusintxt)
        {
            this.space.name = this.nameInput.text;
        }
    }
}
