import { OAVComponent, AttributeViewInfo } from 'feng3d';
import { ComboBox } from '../../ui/components/ComboBox';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVEnum extends OAVBase
{
    public labelLab: eui.Label;
    public combobox: ComboBox;

    private list: { label: string, value: number }[];

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "OAVEnum";
    }

    set enumClass(obj)
    {
        this.list = [];
        for (const key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                if (isNaN(Number(key)))
                    this.list.push({ label: key, value: obj[key] });
            }
        }
    }

    initView()
    {
        if (this._attributeViewInfo.editable)
        {
            this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        }
        this.combobox.touchEnabled = this.combobox.touchChildren = this._attributeViewInfo.editable;
    }

    dispose()
    {
        this.combobox.removeEventListener(egret.Event.CHANGE, this.onComboxChange, this);
    }

    updateView()
    {
        this.combobox.dataProvider = this.list;
        if (this.list)
        {
            this.combobox.data = this.list.reduce((prevalue, item) =>
            {
                if (prevalue) return prevalue;
                if (item.value == this.attributeValue)
                    return item;
                return null;
            }, null);
        }
    }

    private onComboxChange()
    {
        this.attributeValue = this.combobox.data.value;
    }
}
