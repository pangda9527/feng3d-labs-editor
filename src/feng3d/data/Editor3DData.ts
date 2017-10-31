module feng3d.editor
{
    export class Editor3DData
    {
        stage: egret.Stage;

        selectedObject: GameObject | FileInfo;

        object3DOperationID = 0;

        /**
         * 巡视界面数据
         */
        inspectorViewData: InspectorViewData;

        constructor()
        {
            this.inspectorViewData = new InspectorViewData(this);
        }
    }
}