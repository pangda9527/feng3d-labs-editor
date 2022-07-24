import { OAVComponent, IObjectView, AttributeViewInfo, classUtils, objectview, watcher } from 'feng3d';
import { Accordion } from '../../ui/components/Accordion';
import { OAVBase } from './OAVBase';

@OAVComponent()
export class OAVAccordionObjectView extends OAVBase
{
    componentView: IObjectView;

    //
    public accordion: Accordion;

    //
    public enabledCB: eui.CheckBox;

    /**
     * 对象界面数据
     */
    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);
        this.skinName = "ParticleComponentView";
    }

    /**
     * 更新界面
     */
    updateView(): void
    {
        this.updateEnableCB();
        if (this.componentView)
            this.componentView.updateView();
    }

    initView()
    {
        var componentName = classUtils.getQualifiedClassName(this.attributeValue).split(".").pop();
        this.accordion.titleName = componentName;
        this.componentView = objectview.getObjectView(this.attributeValue, { autocreate: false, excludeAttrs: ["enabled"] });
        this.accordion.addContent(this.componentView);

        this.enabledCB = this.accordion["enabledCB"];

        this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
        watcher.watch(this.attributeValue, "enabled", this.updateEnableCB, this);

        this.updateView();
    }

    dispose()
    {
        this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
        watcher.unwatch(this.attributeValue, "enabled", this.updateEnableCB, this);
    }

    private updateEnableCB()
    {
        this.enabledCB.selected = this.attributeValue.enabled;
    }

    private onEnableCBChange()
    {
        this.attributeValue.enabled = this.enabledCB.selected;
    }
}
