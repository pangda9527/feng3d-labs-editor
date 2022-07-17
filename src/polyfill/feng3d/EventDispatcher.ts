namespace feng3d
{
    export interface MixinsGlobalEvents
    {
        "editor.selectedObjectsChanged"
        "editor.isBaryCenterChanged"
        "editor.isWoldCoordinateChanged"
        "editor.toolTypeChanged"
        "editor.allLoaded"

        /**
         * 资源显示文件夹发生变化
         */
        "asset.showFloderChanged": { oldpath: string, newpath: string };
        /**
         * 删除文件
         */
        "asset.deletefile": { id: string };

        /**
         * 显示指定资源
         */
        "asset.showAsset"

        /**
         * 更新属性界面（检查器）
         */
        "inspector.update": undefined;

        /**
         * 保存属性界面（检查器）数据
         */
        "inspector.saveShowData": () => void;

        /**
         * 旋转场景摄像机
         */
        "editorCameraRotate": Vector3

        /**
         * 使用编辑器打开脚本
         */
        "codeeditor.openScript": feng3d.TextAsset;

        /**
         * 脚本编译
         */
        "script.compile": { onComplete?: () => void };

        /**
         * 获取项目依赖库 定义
         */
        "script.gettslibs": { callback: (tslibs: { path: string, code: string }[]) => void }

        /**
         * 提示信息
         */
        "message": string;

        /**
         * 错误信息
         */
        "message.error": string;

        /**
         * 界面布局发生变化
         */
        "viewLayout.changed": string;

        /**
         * 还原默认窗口布局
         */
        "viewLayout.reset": Object;

        /**
         * 打开脚本
         */
        "openScript": feng3d.TextAsset;

        /**
         * 在场景窗口添加工具界面
         */
        "editor.addSceneToolView": eui.Component;
    }
}