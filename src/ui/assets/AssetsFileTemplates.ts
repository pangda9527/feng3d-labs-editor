namespace feng3d.editor
{
    export var assetsFileTemplates = {
        NewScript:
            `namespace feng3d
{
    export class NewScript extends Script
    {
        /**
         * 初始化时调用
         */
        init()
        {

        }

        /**
         * 更新
         */
        update()
        {
            log(this.transform.position);
        }

        /**
         * 销毁时调用
         */
        dispose()
        {

        }
    }
}`,
    };
}