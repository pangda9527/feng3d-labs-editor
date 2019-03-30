namespace editor
{
    export class EditorCache
    {
        /**
         * 保存最后一次打开的项目路径
         */
        projectname: string;

        /**
         * 最近的项目列表
         */
        lastProjects: string[] = [];

        /**
         * 界面布局数据
         */
        viewLayout: Object;

        /**
         * 设置最近打开的项目
         */
        setLastProject(projectname: string)
        {
            var index = this.lastProjects.indexOf(projectname);
            if (index != -1)
                this.lastProjects.splice(index, 1);
            this.lastProjects.unshift(projectname);
        }

        constructor()
        {
            var value = localStorage.getItem("feng3d-editor");
            if (!value) return;
            var obj = JSON.parse(value);
            for (var key in obj)
            {
                if (obj.hasOwnProperty(key))
                {
                    this[key] = obj[key];
                }
            }
        }

        save()
        {
            localStorage.setItem("feng3d-editor", JSON.stringify(this, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1'));
        }
    }

    export var editorcache = new EditorCache();

    window.addEventListener("beforeunload", () =>
    {
        if (codeeditoWin) codeeditoWin.close();
        if (runwin) runwin.close();
        editorcache.save();
    });
}