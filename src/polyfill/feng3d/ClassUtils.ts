import { classUtils } from 'feng3d';

export { };

document.body.oncontextmenu = function () { return false; }

//给反射添加查找的空间
classUtils.addClassNameSpace("editor");
classUtils.addClassNameSpace("egret");
