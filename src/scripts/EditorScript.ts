namespace editor
{
    /**
     * 编辑器脚本
     */
    export class EditorScript extends feng3d.ScriptComponent
    {
        showInInspector = false;
        serializable = false;

        flag = feng3d.ScriptFlag.editor;
    }
}