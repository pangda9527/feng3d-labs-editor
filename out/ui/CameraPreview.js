"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var EditorData_1 = require("../global/EditorData");
var Main3D_1 = require("../feng3d/Main3D");
var CameraPreview = /** @class */ (function (_super) {
    __extends(CameraPreview, _super);
    function CameraPreview() {
        var _this = _super.call(this) || this;
        _this.skinName = "CameraPreview";
        //
        var canvas = _this.canvas = document.getElementById("cameraPreviewCanvas");
        ;
        _this.previewEngine = new feng3d.Engine(canvas);
        _this.previewEngine.mouse3DManager.mouseInput.enable = false;
        _this.previewEngine.stop();
        return _this;
    }
    Object.defineProperty(CameraPreview.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        set: function (value) {
            if (this._camera) {
                feng3d.ticker.offframe(this.onframe, this);
            }
            this._camera = value;
            this.previewEngine.camera = this._camera;
            this.visible = !!this._camera;
            this.canvas.style.display = this._camera ? "inline" : "none";
            if (this._camera) {
                feng3d.ticker.onframe(this.onframe, this);
            }
        },
        enumerable: true,
        configurable: true
    });
    CameraPreview.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.initView();
    };
    CameraPreview.prototype.initView = function () {
        var _this = this;
        if (this.saveParent)
            return;
        this.saveParent = this.parent;
        feng3d.ticker.nextframe(function () {
            _this.parent.removeChild(_this);
        });
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
        this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
        this.onResize();
    };
    CameraPreview.prototype.onResize = function () {
        if (!this.stage)
            return;
        var lt = this.group.localToGlobal(0, 0);
        var rb = this.group.localToGlobal(this.group.width, this.group.height);
        var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
        var style = this.canvas.style;
        style.position = "absolute";
        style.left = bound.x + "px";
        style.top = bound.y + "px";
        style.width = bound.width + "px";
        style.height = bound.height + "px";
        style.cursor = "hand";
    };
    CameraPreview.prototype.onDataChange = function () {
        var selectedGameObjects = EditorData_1.editorData.selectedGameObjects;
        if (selectedGameObjects.length > 0) {
            for (var i = 0; i < selectedGameObjects.length; i++) {
                var camera = selectedGameObjects[i].getComponent(feng3d.Camera);
                if (camera) {
                    this.camera = camera;
                    this.saveParent.addChild(this);
                    return;
                }
            }
        }
        this.camera = null;
        this.parent && this.parent.removeChild(this);
    };
    CameraPreview.prototype.onframe = function () {
        if (this.previewEngine.scene != Main3D_1.engine.scene) {
            this.previewEngine.scene = Main3D_1.engine.scene;
        }
        this.previewEngine.render();
    };
    return CameraPreview;
}(eui.Component));
exports.CameraPreview = CameraPreview;
//# sourceMappingURL=CameraPreview.js.map