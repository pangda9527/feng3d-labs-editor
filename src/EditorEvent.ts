namespace feng3d.editor
{
    export interface EditorEventMap
    {
        Create_Object3D
        saveScene
        import
    }

    export interface EditorEvent
    {
        once<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof EditorEventMap>(type: K, data?: EditorEventMap[K], bubbles?: boolean);
        has<K extends keyof EditorEventMap>(type: K): boolean;
        on<K extends keyof EditorEventMap>(type: K, listener: (event: EditorEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof EditorEventMap>(type?: K, listener?: (event: EditorEventMap[K]) => any, thisObject?: any);
    }

    export var $editorEventDispatcher: EditorEvent = new Event();
}