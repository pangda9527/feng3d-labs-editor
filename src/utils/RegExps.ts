namespace feng3d.editor
{
    /**
     * 常用正则表示式
     */
    export var regExps: RegExps;

    /**
     * 常用正则表示式
     */
    export class RegExps
    {
        /**
         * 图片
         */
        image = /(\.jpg|\.png|\.jpeg|\.gif)\b/i;

        /**
         * 命名空间
         */
        namespace = /namespace\s+([\w$_\d\.]+)/;

        /**
         * 导出类
         */
        exportClass = /export\s+(abstract\s+)?class\s+([\w$_\d]+)(\s+extends\s+([\w$_\d]+))?/;

        /**
         * 脚本中的类
         */
        scriptClass = /(export\s+)?class\s+([\w$_\d]+)\s+extends\s+(([\w$_\d\.]+))/;
    }

    regExps = new RegExps();
}