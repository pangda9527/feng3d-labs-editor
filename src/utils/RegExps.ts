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
        image = /(.jpg|.png|.jpeg)\b/i;
    }

    regExps = new RegExps();
}