namespace feng3d.editor
{
    /**
     * 是否本地应用
     */
    export var isNative = isSuportNative();
}

// declare function require(name: string);
declare var __dirname: string;

/**
 * 判断是否支持本地操作
 */
function isSuportNative()
{
    return typeof require != "undefined" && require("fs") != null;
}