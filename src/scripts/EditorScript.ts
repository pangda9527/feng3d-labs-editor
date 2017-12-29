namespace feng3d.editor
{
    /**
     * 编辑器脚本
     */
    export class EditorScript extends Script
    {
        showInInspector = false;
        serializable = false;

        flag = ScriptFlag.editor;
    }
}