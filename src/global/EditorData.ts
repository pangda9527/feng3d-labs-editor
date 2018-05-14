namespace feng3d.editor
{

    /**
     * 编辑器数据
     */
    export var editorData: EditorData;

    /**
     * 编辑器数据
     */
    export class EditorData
    {
        get DBname()
        {
            return feng3d.DBname;
        }

        set DBname(v)
        {
            feng3d.DBname = v;
        }

        /**
         * 2D UI舞台
         */
        stage: egret.Stage;

        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        selectedObjects: (GameObject | AssetsFile)[];

        /**
         * 位移旋转缩放工具对象
         */
        mrsToolObject: GameObject;

        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(...objs: (GameObject | AssetsFile)[])
        {
            if (shortcut.keyState.getKeyState("ctrl") && this.selectedObjects)
            {
                var oldobjs = this.selectedObjects.concat();
                if (objs)
                {
                    objs.forEach(obj =>
                    {
                        if (oldobjs.indexOf(obj) != -1)
                            oldobjs.splice(oldobjs.indexOf(obj), 1);
                        else
                            oldobjs.push(obj);
                    });
                }
                objs = oldobjs;
            }
            this.selectedObjects = objs;
        }

        /**
         * 选中游戏对象列表
         */
        get selectedGameObjects()
        {
            var result: GameObject[] = [];

            if (this.selectedObjects)
            {
                this.selectedObjects.forEach(element =>
                {
                    if (element instanceof GameObject)
                        result.push(element);
                });
            }
            return result;
        }

        /**
         * 第一个选中游戏对象
         */
        get firstSelectedGameObject()
        {
            return this.selectedGameObjects[0];
        }

        /**
         * 获取 受 MRSTool 控制的Transform列表
         */
        get mrsTransforms()
        {
            var transforms = <Transform[]>this.selectedGameObjects.reduce((result, item) =>
            {
                if (item.getComponent(Scene3D))
                    return result;
                if (item.getComponent(Trident))
                    return result;
                if (item.getComponent(GroundGrid))
                    return result;
                if (item.getComponent(SkinnedMeshRenderer))
                    return result;
                result.push(item.transform);
                return result;
            }, []);
            return transforms;
        }

        /**
         * 选中游戏对象列表
         */
        get selectedAssetsFile()
        {
            var result: AssetsFile[] = [];

            if (this.selectedObjects)
            {
                this.selectedObjects.forEach(element =>
                {
                    if (element instanceof AssetsFile)
                        result.push(element);
                });
            }
            return result;
        }

        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetsPath(url: string)
        {
            return document.URL + "resource/" + url;
        }

        constructor()
        {
            this.DBname = "feng3d-editor";
        }
    }

    editorData = new EditorData();
}