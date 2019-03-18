declare namespace editor {
    class OAVParticleComponentList extends OAVBase {
        protected _space: feng3d.ParticleSystem;
        group: eui.Group;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: feng3d.ParticleSystem;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private addComponentView;
        private removedComponentView;
    }
}
//# sourceMappingURL=OAVParticleComponentList.d.ts.map