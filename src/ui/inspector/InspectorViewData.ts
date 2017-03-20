module feng3d.editor
{

    /**
     * 巡视界面数据
     * @author feng     2017-03-20
     */
    export class InspectorViewData
    {
        public viewData: any;

        constructor(editor3DData: Editor3DData)
        {
            Watcher.watch(editor3DData, ["selectedObject3D"], this.updateView, this)
        }

        public showData(data: any)
        {
            this.viewData = data;
        }

        private updateView()
        {
            this.showData(editor3DData.selectedObject3D)
        }
    }
}