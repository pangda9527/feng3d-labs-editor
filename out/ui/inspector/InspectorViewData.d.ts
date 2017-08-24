declare namespace feng3d.editor {
    interface InspectorViewDataEventMap {
        change: any;
    }
    interface InspectorViewData {
        once<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof InspectorViewDataEventMap>(type: K, data?: InspectorViewDataEventMap[K], bubbles?: boolean): any;
        has<K extends keyof InspectorViewDataEventMap>(type: K): boolean;
        on<K extends keyof InspectorViewDataEventMap>(type: K, listener: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof InspectorViewDataEventMap>(type?: K, listener?: (event: InspectorViewDataEventMap[K]) => any, thisObject?: any): any;
    }
    /**
     * 巡视界面数据
     * @author feng     2017-03-20
     */
    class InspectorViewData extends Event {
        hasBackData: boolean;
        viewData: any;
        private viewDataList;
        constructor(editor3DData: Editor3DData);
        showData(data: any, removeBack?: boolean): void;
        back(): void;
        private updateView();
    }
}
