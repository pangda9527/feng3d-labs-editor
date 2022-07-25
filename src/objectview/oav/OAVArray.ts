import { OAVComponent, AttributeViewInfo, lazy } from 'feng3d';
import { OAVBase } from './OAVBase';
import { OAVDefault } from './OAVDefault';

@OAVComponent()
export class OAVArray extends OAVBase
{
    public group: eui.Group;
    public titleGroup: eui.Group;
    public labelLab: eui.Label;
    public contentGroup: eui.Group;
    public sizeTxt: eui.TextInput;

    private attributeViews: eui.Component[];

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = 'OAVArray';
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

    get attributeValue(): any[]
    {
        return this._space[this._attributeName];
    }

    set attributeValue(value: any[])
    {
        if (this._space[this._attributeName] !== value)
        {
            this._space[this._attributeName] = value;
        }
        this.updateView();
    }

    initView(): void
    {
        this.attributeViews = [];
        const attributeValue = this.attributeValue;
        this.sizeTxt.text = this.attributeValue.length.toString();
        for (let i = 0; i < attributeValue.length; i++)
        {
            const displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
            displayObject.percentWidth = 100;
            this.contentGroup.addChild(displayObject);
            this.attributeViews[i] = <any>displayObject;
        }
        this.currentState = 'hide';
        this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleGroupClick, this);
        this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
    }

    dispose()
    {
        this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleGroupClick, this);
        this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);

        this.attributeViews = [];
        for (let i = 0; i < this.attributeViews.length; i++)
        {
            const displayObject = this.attributeViews[i];
            this.contentGroup.removeChild(displayObject);
        }
        this.attributeViews = null;
    }

    private onTitleGroupClick()
    {
        this.currentState = this.currentState === 'hide' ? 'show' : 'hide';
    }

    private onsizeTxtfocusout()
    {
        const size = parseInt(this.sizeTxt.text, 10);
        const attributeValue = this.attributeValue;
        const attributeViews = this.attributeViews;
        if (size !== attributeValue.length)
        {
            for (let i = 0; i < attributeViews.length; i++)
            {
                if (attributeViews[i].parent)
                {
                    attributeViews[i].parent.removeChild(attributeViews[i]);
                }
            }

            attributeValue.length = size;
            for (let i = 0; i < size; i++)
            {
                if (!attributeValue[i] && this._attributeViewInfo.componentParam)
                    { attributeValue[i] = lazy.getvalue((<any> this._attributeViewInfo.componentParam).defaultItem); }

                if (!attributeViews[i])
                {
                    const displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                    attributeViews[i] = displayObject;

                    displayObject.percentWidth = 100;
                }
                this.contentGroup.addChild(attributeViews[i]);
            }
        }
    }
}

export class OAVArrayItem extends OAVDefault
{
    constructor(arr: any[], index: number, componentParam: Object)
    {
        const attributeViewInfo: AttributeViewInfo = {
            name: `${index}`,
            editable: true,
            componentParam,
            owner: arr,
            type: 'number',
        };
        super(attributeViewInfo);
    }

    initView()
    {
        super.initView();
        this.labelLab.width = 60;
    }
}
