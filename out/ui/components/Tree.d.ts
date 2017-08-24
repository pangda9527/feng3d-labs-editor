declare namespace feng3d.editor {
    interface ITreeNode {
        label: string;
        children?: ITreeNode[];
    }
    class TreeCollection extends egret.EventDispatcher implements eui.ICollection {
        private _rootNode;
        readonly length: number;
        constructor(rootNode: ITreeNode);
        getItemAt(index: number): ITreeNode;
        getItemIndex(item: ITreeNode): number;
    }
}
