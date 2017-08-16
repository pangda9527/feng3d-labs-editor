namespace feng3d.editor
{
    export interface InspectorViewDataEventMap
    {
        change;
    }

    export interface InspectorViewData
    {
        once<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof InspectorViewDataEventMap>(type: K, data?: InspectorViewDataEventMap[K], bubbles?: boolean);
        has<K extends keyof InspectorViewDataEventMap>(type: K): boolean;
        on<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof InspectorViewDataEventMap>(type?: K, listener?: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any);
    }

    /**
     * 巡视界面数据
     * @author feng     2017-03-20
     */
    export class InspectorViewData extends Event
    {
        hasBackData = false;

        viewData: any;
        private viewDataList = [];

        constructor(editor3DData: Editor3DData)
        {
            super();
            eui.Watcher.watch(editor3DData, ["selectedObject"], this.updateView, this)
        }

        showData(data: any, removeBack = false)
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

            this.dispatch("change");
        }

        back()
        {
            this.viewData = this.viewDataList.pop();
            this.hasBackData = this.viewDataList.length > 0;
            this.dispatch("change");
        }

        private updateView()
        {
            this.showData(editor3DData.selectedObject, true)
        }
    }
}