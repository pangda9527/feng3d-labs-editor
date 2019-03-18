declare namespace editor {
    class ParticleComponentView extends eui.Component {
        component: feng3d.ParticleModule;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.ParticleModule);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete;
        private onAddToStage;
        private onRemovedFromStage;
        private updateEnableCB;
        private onEnableCBChange;
    }
}
//# sourceMappingURL=ParticleComponentView.d.ts.map