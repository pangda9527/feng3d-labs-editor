declare namespace feng3d.editor {
    interface EditorEventMap {
        Create_Object3D: any;
        saveScene: any;
        import: any;
    }
    interface EditorEvent {
        once<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof EditorEventMap>(type: K, data?: EditorEventMap[K], bubbles?: boolean): any;
        has<K extends keyof EditorEventMap>(type: K): boolean;
        on<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof EditorEventMap>(type?: K, listener?: (event: EditorEventMap[K]) => any, thisObject?: any): any;
    }
    var $editorEventDispatcher: EditorEvent;
}
