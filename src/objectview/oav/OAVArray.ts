import { OAVBase } from "./OAVBase";
import { OAVDefault } from "./OAVDefault";

@feng3d.OAVComponent()
export class OAVArray extends OAVBase
{
    public group: eui.Group;
    public titleGroup: eui.Group;
    public titleButton: eui.Rect;
    public contentGroup: eui.Group;
    public sizeTxt: eui.TextInput;

    private attributeViews: eui.Component[];

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "OAVArray";
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
        if (this._space[this._attributeName] != value)
        {
            this._space[this._attributeName] = value;
        }
        this.updateView();
    }

    initView(): void
    {
        this.attributeViews = [];
        var attributeValue = this.attributeValue;
        this.sizeTxt.text = this.attributeValue.length.toString();
        for (var i = 0; i < attributeValue.length; i++)
        {
            var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
            displayObject.percentWidth = 100;
            this.contentGroup.addChild(displayObject);
            this.attributeViews[i] = <any>displayObject;
        }
        this.currentState = "hide";
        this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
    }

    dispose()
    {
        this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);

        this.attributeViews = [];
        for (var i = 0; i < this.attributeViews.length; i++)
        {
            var displayObject = this.attributeViews[i];
            this.contentGroup.removeChild(displayObject);
        }
        this.attributeViews = null;
    }

    private onTitleButtonClick()
    {
        this.currentState = this.currentState == "hide" ? "show" : "hide";
    }

    private onsizeTxtfocusout()
    {
        var size = parseInt(this.sizeTxt.text);
        var attributeValue = this.attributeValue;
        var attributeViews = this.attributeViews;
        if (size != attributeValue.length)
        {
            for (var i = 0; i < attributeViews.length; i++)
            {
                if (attributeViews[i].parent)
                {
                    attributeViews[i].parent.removeChild(attributeViews[i]);
                }
            }

            attributeValue.length = size;
            for (var i = 0; i < size; i++)
            {
                if (attributeValue[i] == null && this._attributeViewInfo.componentParam)
                    attributeValue[i] = feng3d.lazy.getvalue((<any>this._attributeViewInfo.componentParam).defaultItem);

                if (attributeViews[i] == null)
                {
                    var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
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
        var attributeViewInfo: feng3d.AttributeViewInfo = {
            name: index + "",
            editable: true,
            componentParam: componentParam,
            owner: arr,
            type: "number",
        };
        super(attributeViewInfo);
    }

    initView()
    {
        super.initView();
        this.labelLab.width = 60;
    }
}