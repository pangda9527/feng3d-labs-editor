import { Material, OAVComponent, AttributeViewInfo, globalEmitter, shaderlib } from 'feng3d';
import { ComboBox } from '../../ui/components/ComboBox';
import { OAVBase } from './OAVBase';

export interface OAVMaterialName
{
    get space(): Material;
}

@OAVComponent()
export class OAVMaterialName extends OAVBase
{
    public tileIcon: eui.Image;
    public nameLabel: eui.Label;
    public operationBtn: eui.Button;
    public helpBtn: eui.Button;
    public shaderComboBox: ComboBox;
    public group: eui.Group;
    //

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "OVMaterial";
    }

    initView()
    {
        this.shaderComboBox.addEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
        globalEmitter.on("asset.shaderChanged", this.onShaderComboBoxChange, this);

        this.shaderComboBox.touchChildren = this.shaderComboBox.touchEnabled = this._attributeViewInfo.editable;
    }

    dispose()
    {
        this.shaderComboBox.removeEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
        globalEmitter.off("asset.shaderChanged", this.onShaderComboBoxChange, this);
    }

    updateView()
    {
        var material = this.space;
        this.nameLabel.text = material.shaderName;

        var data = shaderlib.getShaderNames().sort().map((v) => { return { label: v, value: v } });
        var selected = data.reduce((prevalue, item) =>
        {
            if (prevalue) return prevalue;
            if (item.value == material.shaderName)
                return item;
            return null;
        }, null);
        this.shaderComboBox.dataProvider = data;
        this.shaderComboBox.data = selected;
    }

    private onShaderComboBoxChange()
    {
        this.attributeValue = this.shaderComboBox.data.value;
        this.objectView.space = this.space;
    }
}
