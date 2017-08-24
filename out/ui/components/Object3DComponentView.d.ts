declare namespace feng3d.editor {
    class Object3DComponentView extends eui.Component {
        component: Component;
        componentView: IObjectView;
        accordion: feng3d.editor.Accordion;
        deleteButton: eui.Button;
        /**
         * 对象界面数据
         */
        constructor(component: Component);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete();
    }
}
