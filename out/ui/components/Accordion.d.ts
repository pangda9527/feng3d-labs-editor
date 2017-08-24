declare namespace feng3d.editor {
    class Accordion extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        private components;
        titleName: string;
        constructor();
        addContent(component: eui.Component): void;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onTitleButtonClick();
    }
}
