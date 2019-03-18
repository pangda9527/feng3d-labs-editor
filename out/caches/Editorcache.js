"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TopView_1 = require("../ui/TopView");
var EditorCache = /** @class */ (function () {
    function EditorCache() {
        /**
         * 最近的项目列表
         */
        this.lastProjects = [];
        var value = localStorage.getItem("feng3d-editor");
        if (!value)
            return;
        var obj = JSON.parse(value);
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
    }
    /**
     * 设置最近打开的项目
     */
    EditorCache.prototype.setLastProject = function (projectname) {
        var index = this.lastProjects.indexOf(projectname);
        if (index != -1)
            this.lastProjects.splice(index, 1);
        this.lastProjects.unshift(projectname);
    };
    EditorCache.prototype.save = function () {
        localStorage.setItem("feng3d-editor", JSON.stringify(this, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1'));
    };
    return EditorCache;
}());
exports.EditorCache = EditorCache;
exports.editorcache = new EditorCache();
window.addEventListener("beforeunload", function () {
    if (codeeditoWin)
        codeeditoWin.close();
    if (TopView_1.runwin)
        TopView_1.runwin.close();
    exports.editorcache.save();
});
//# sourceMappingURL=Editorcache.js.map