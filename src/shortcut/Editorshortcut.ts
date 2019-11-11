namespace editor
{
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
            feng3d.shortcut.on("duplicate", this.onDuplicate, this);
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
            
        }

        private onPaste()
        {

        }

        private onDuplicate()
        {

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
}