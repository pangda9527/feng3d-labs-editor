module feng3d.editor
{

    /**
     * 巡视界面数据
     * @author feng     2017-03-20
     */
    export class InspectorViewData extends EventDispatcher
    {
        public hasBackData = false;

        public viewData: any;
        private viewDataList = [];

        constructor(editor3DData: Editor3DData)
        {
            super();
            Watcher.watch(editor3DData, ["selectedObject3D"], this.updateView, this)
        }

        public showData(data: any, removeBack = false)
        {
            if (this.viewData)
            {
                this.viewDataList.push(this.viewData);
            }
            if (removeBack)
            {
                this.viewDataList.length = 0;
            }
            this.hasBackData = this.viewDataList.length > 0;
            //
            this.viewData = data;

            this.dispatchEvent(new Event(Event.CHANGE));
        }

        public back()
        {
            this.viewData = this.viewDataList.pop();
            this.hasBackData = this.viewDataList.length > 0;
            this.dispatchEvent(new Event(Event.CHANGE));
        }

        private updateView()
        {
            this.showData(editor3DData.selectedObject3D, true)
        }
    }
}