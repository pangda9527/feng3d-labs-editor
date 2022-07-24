
export class Editorshortcut
{
    constructor()
    {
        // 初始化快捷键
        feng3d.shortcut.addShortCuts(shortcutConfig);

        //监听命令
        feng3d.shortcut.on("deleteSeletedGameObject", this.onDeleteSeletedGameObject, this);
        //
        feng3d.shortcut.on("gameobjectMoveTool", this.onGameobjectMoveTool, this);
        feng3d.shortcut.on("gameobjectRotationTool", this.onGameobjectRotationTool, this);
        feng3d.shortcut.on("gameobjectScaleTool", this.onGameobjectScaleTool, this);
        //
        feng3d.shortcut.on("openDevTools", this.onOpenDevTools, this);
        feng3d.shortcut.on("refreshWindow", this.onRefreshWindow, this);
        // 
        feng3d.shortcut.on("copy", this.onCopy, this);
        feng3d.shortcut.on("paste", this.onPaste, this);
        feng3d.shortcut.on("undo", this.onUndo, this);
    }

    private onGameobjectMoveTool()
    {
        editorData.toolType = MRSToolType.MOVE;
    }

    private onGameobjectRotationTool()
    {
        editorData.toolType = MRSToolType.ROTATION;
    }

    private onGameobjectScaleTool()
    {
        editorData.toolType = MRSToolType.SCALE;
    }

    private onDeleteSeletedGameObject()
    {
        var selectedObject = editorData.selectedObjects;

        if (!selectedObject)
            return;
        //删除文件引用计数
        selectedObject.forEach(element =>
        {
            if (element instanceof feng3d.GameObject)
            {
                element.remove();
            } else if (element instanceof AssetNode)
            {
                element.delete();
            }
        });
        editorData.clearSelectedObjects();
    }

    private onOpenDevTools()
    {
        if (nativeAPI) nativeAPI.openDevTools();
    }

    private onRefreshWindow()
    {
        window.location.reload();
    }

    private onCopy()
    {
        var objects = editorData.selectedObjects.filter(v => v instanceof feng3d.GameObject);
        editorData.copyObjects = objects;
    }

    private onPaste()
    {
        var undoSelectedObjects = editorData.selectedObjects;
        //
        var objects: feng3d.GameObject[] = editorData.copyObjects.filter(v => v instanceof feng3d.GameObject);
        if (objects.length == 0) return;
        var parent = objects[0].parent;
        var newGameObjects = objects.map(v => feng3d.serialization.clone(v));
        newGameObjects.forEach(v =>
        {
            parent.addChild(v);
        });
        editorData.selectMultiObject(newGameObjects, false);

        // undo
        editorData.undoList.push(() =>
        {
            newGameObjects.forEach(v =>
            {
                v.remove();
            });
            editorData.selectMultiObject(undoSelectedObjects, false);
        });
    }

    private onUndo()
    {
        var item = editorData.undoList.pop();
        if (item) item();
    }
}

export class SceneControlConfig
{
    mouseWheelMoveStep = 0.004;

    //dynamic
    lookDistance = 3;

    sceneCameraForwardBackwardStep = 0.01;
}
export var sceneControlConfig = new SceneControlConfig();
