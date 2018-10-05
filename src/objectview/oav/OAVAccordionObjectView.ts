namespace editor
{
    @feng3d.OAVComponent()
    export class OAVAccordionObjectView extends OAVBase
    {
        componentView: feng3d.IObjectView;

        //
        public accordion: editor.Accordion;

        //
        public enabledCB: eui.CheckBox;

		/**
		 * 对象界面数据
		 */
        constructor(attributeViewInfo: feng3d.AttributeViewInfo)
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
            var componentName = feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.attributeValue, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);

            this.enabledCB = this.accordion["enabledCB"];

            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.attributeValue, "enabled", this.updateEnableCB, this);

            this.updateView();
        }

        dispose()
        {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.attributeValue, "enabled", this.updateEnableCB, this);
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
}