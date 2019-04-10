namespace feng3d
{
    document.body.oncontextmenu = function () { return false; }

    //给反射添加查找的空间
    feng3d.classUtils.addClassNameSpace("editor");
    feng3d.classUtils.addClassNameSpace("egret");
}