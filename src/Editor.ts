module feng3d.editor
{
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    export class Editor extends eui.UILayer
    {
        constructor()
        {
            super();

            //
            new EditorEnvironment();


            //初始化feng3d
            new Main3D();

            shortcut.addShortCuts(shortcutConfig);

            this.addChild(new MainUI());

            this.once(egret.Event.ENTER_FRAME, function ()
            {
                //
                mouseEventEnvironment = new MouseEventEnvironment();
            }, this);

            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        }

        private _onAddToStage()
        {
            editor3DData.stage = this.stage;
        }
    }

    /*************************** 初始化模块 ***************************/
    //初始化配置
    $objectViewConfig = objectViewConfig;

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

    //
    export var editor3DData = new Editor3DData();
}