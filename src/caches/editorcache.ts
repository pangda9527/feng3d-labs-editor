module feng3d.editor
{
    export interface EditorCache
    {
        /**
         * 保存最后一次打开的项目路径
         */
        projectpath?: string;
        /**
         * 历史项目路径列表
         */
        historyprojectpaths?: string[];
    }

    export var editorcache: EditorCache = {};
}