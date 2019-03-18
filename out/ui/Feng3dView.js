var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../global/editorui", "./drag/Drag", "../feng3d/hierarchy/Hierarchy", "../feng3d/Main3D"], function (require, exports, editorui_1, Drag_1, Hierarchy_1, Main3D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Feng3dView = /** @class */ (function (_super) {
        __extends(Feng3dView, _super);
        function Feng3dView() {
            var _this = _super.call(this) || this;
            _this.skinName = "Feng3dViewSkin";
            feng3d.Stats.init(document.getElementById("stats"));
            editorui_1.editorui.feng3dView = _this;
            return _this;
        }
        Feng3dView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.canvas = document.getElementById("glcanvas");
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            this.onResize();
            Drag_1.drag.register(this, null, ["file_gameobject", "file_script"], function (dragdata) {
                if (dragdata.file_gameobject) {
                    Hierarchy_1.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, Hierarchy_1.hierarchy.rootnode.gameobject);
                }
                if (dragdata.file_script) {
                    var gameobject = Main3D_1.engine.mouse3DManager.selectedGameObject;
                    if (!gameobject || !gameobject.scene)
                        gameobject = Hierarchy_1.hierarchy.rootnode.gameobject;
                    gameobject.addScript(dragdata.file_script.scriptName);
                }
            });
        };
        Feng3dView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.canvas = null;
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            Drag_1.drag.unregister(this);
        };
        Feng3dView.prototype.onMouseOver = function () {
            feng3d.shortcut.activityState("mouseInView3D");
        };
        Feng3dView.prototype.onMouseOut = function () {
            feng3d.shortcut.deactivityState("mouseInView3D");
        };
        Feng3dView.prototype.onResize = function () {
            if (!this.stage)
                return;
            var lt = this.localToGlobal(0, 0);
            var rb = this.localToGlobal(this.width, this.height);
            var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
            feng3d.Stats.instance.dom.style.left = bound.x + "px";
            feng3d.Stats.instance.dom.style.top = bound.y + "px";
        };
        return Feng3dView;
    }(eui.Component));
    exports.Feng3dView = Feng3dView;
});
//# sourceMappingURL=Feng3dView.js.map