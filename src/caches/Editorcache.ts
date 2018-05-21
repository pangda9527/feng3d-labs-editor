namespace feng3d.editor
{
    export class EditorCache
    {
        /**
         * 保存最后一次打开的项目路径
         */
        projectname: string;

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
            localStorage.setItem("feng3d-editor", JSON.stringify(this));
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