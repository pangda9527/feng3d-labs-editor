import { IObjectAttributeView, AttributeViewInfo, IObjectView, IObjectBlockView } from 'feng3d';
import { toolTip } from '../../ui/components/ToolTip';
import { ObjectViewEvent } from '../events/ObjectViewEvent';

export class OAVBase extends eui.Component implements IObjectAttributeView
{
    protected _space: any;
    protected _attributeName: string;
    protected _attributeType: string;
    protected _attributeViewInfo: AttributeViewInfo;
    //
    labelLab: eui.Label;

    /**
     * 对象属性界面
     */
    objectView: IObjectView;
    /**
     * 对象属性块界面
     */
    objectBlockView: IObjectBlockView;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super();
        this._space = attributeViewInfo.owner;
        this._attributeName = attributeViewInfo.name;
        this._attributeType = attributeViewInfo.type;
        this._attributeViewInfo = attributeViewInfo;

        if (!this._attributeViewInfo.editable) this.alpha = 0.8;
    }

    get space(): any
    {
        return this._space;
    }

    set space(value: any)
    {
        this._space = value;
        this.dispose();
        this.initView();
        this.updateView();
    }

    // 占用，避免出现label命名的组件
    private label = "";

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);

        var componentParam = this._attributeViewInfo.componentParam;
        if (componentParam)
        {
            for (var key in componentParam)
            {
                if (componentParam.hasOwnProperty(key))
                {
                    this[key] = componentParam[key];
                }
            }
        }
        if (this.labelLab)
        {
            if (this.label)
                this.labelLab.text = this.label;
            else
                this.labelLab.text = this._attributeName;
        }
        if (this._attributeViewInfo.tooltip)
            toolTip.register(this.labelLab, this._attributeViewInfo.tooltip);

        this.initView();
        this.updateView();
    }

    $onRemoveFromStage()
    {
        toolTip.unregister(this.labelLab);

        super.$onRemoveFromStage()
        this.dispose();
    }

    /**
     * 初始化
     */
    initView()
    {

    }

    /**
     * 销毁
     */
    dispose()
    {

    }

    /**
     * 更新
     */
    updateView()
    {

    }

    get attributeName(): string
    {
        return this._attributeName;
    }

    get attributeValue(): any
    {
        return this._space[this._attributeName];
    }

    set attributeValue(value: any)
    {
        if (this._space[this._attributeName] != value)
        {
            this._space[this._attributeName] = value;
            var objectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this._space;
            objectViewEvent.attributeName = this._attributeName;
            objectViewEvent.attributeValue = this.attributeValue;
            this.dispatchEvent(objectViewEvent);
        }
        this.once(egret.Event.ENTER_FRAME, this.updateView, this);
    }
}
