module feng3d.editor
{
    export var editorshortcut = {
        init: init,
    };

    function init()
    {
        //监听命令
        shortcut.on("deleteSeletedObject3D", onDeleteSeletedObject3D);
    }

    function onDeleteSeletedObject3D()
    {
        if (!editor3DData.selectedObject)
            return;
        if (editor3DData.selectedObject instanceof GameObject)
        {
            editor3DData.selectedObject.remove();
        } else
        {
            assets.deletefile(editor3DData.selectedObject.path);
        }
        //
        editor3DData.selectedObject = null;
    }
}