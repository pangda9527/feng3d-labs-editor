namespace feng3d.editor
{
    export var assetsFileTemplates = {
        NewScript: `
namespace feng3d
{
    export class NewScript extends Script
    {
        /**
         * 初始化时调用
         */
        start()
        {

        }

        /**
         * 更新
         */
        update()
        {
            log(this.gameObject.transform.position);
        }

        /**
         * 销毁时调用
         */
        end()
        {

        }
    }
}
`
    };
}