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
define(["require", "exports", "./MTool", "./RTool", "./STool", "../../global/EditorData"], function (require, exports, MTool_1, RTool_1, STool_1, EditorData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // namespace feng3d { export interface ComponentMap { MRSTool: editor.MRSTool } }
    /**
     * 设置永久可见
     */
    function setAwaysVisible(component) {
        var models = component.getComponentsInChildren(feng3d.Model);
        models.forEach(function (element) {
            if (element.material && !element.material.assetId) {
                element.material.renderParams.depthtest = false;
            }
        });
    }
    /**
     * 位移旋转缩放工具
     */
    var MRSTool = /** @class */ (function (_super) {
        __extends(MRSTool, _super);
        function MRSTool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MRSTool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.mrsToolObject = Object.setValue(new feng3d.GameObject(), { name: "MRSTool" });
            this.mTool = Object.setValue(new feng3d.GameObject(), { name: "MTool" }).addComponent(MTool_1.MTool);
            this.rTool = Object.setValue(new feng3d.GameObject(), { name: "RTool" }).addComponent(RTool_1.RTool);
            this.sTool = Object.setValue(new feng3d.GameObject(), { name: "STool" }).addComponent(STool_1.STool);
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);
            //
            this.currentTool = this.mTool;
            //
            feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.dispatcher.on("editor.toolTypeChanged", this.onToolTypeChange, this);
        };
        MRSTool.prototype.dispose = function () {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            //
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.dispatcher.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.dispatcher.off("editor.toolTypeChanged", this.onToolTypeChange, this);
            _super.prototype.dispose.call(this);
        };
        MRSTool.prototype.onSelectedGameObjectChange = function () {
            var objects = EditorData_1.editorData.selectedGameObjects.filter(function (v) { return !(v.hideFlags & feng3d.HideFlags.DontTransform); });
            //筛选出 工具控制的对象
            if (objects.length > 0) {
                this.gameObject.addChild(this.mrsToolObject);
            }
            else {
                this.mrsToolObject.remove();
            }
        };
        MRSTool.prototype.onToolTypeChange = function () {
            switch (EditorData_1.editorData.toolType) {
                case EditorData_1.MRSToolType.MOVE:
                    this.currentTool = this.mTool;
                    break;
                case EditorData_1.MRSToolType.ROTATION:
                    this.currentTool = this.rTool;
                    break;
                case EditorData_1.MRSToolType.SCALE:
                    this.currentTool = this.sTool;
                    break;
            }
        };
        Object.defineProperty(MRSTool.prototype, "currentTool", {
            set: function (value) {
                if (this._currentTool == value)
                    return;
                if (this._currentTool) {
                    this._currentTool.gameObject.remove();
                }
                this._currentTool = value;
                if (this._currentTool) {
                    this.mrsToolObject.addChild(this._currentTool.gameObject);
                }
            },
            enumerable: true,
            configurable: true
        });
        return MRSTool;
    }(feng3d.Component));
    exports.MRSTool = MRSTool;
});
//# sourceMappingURL=MRSTool.js.map