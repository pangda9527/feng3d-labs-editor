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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./OAVBase", "../../feng3d/Feng3dScreenShot"], function (require, exports, OAVBase_1, Feng3dScreenShot_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OAVFeng3dPreView = /** @class */ (function (_super) {
        __extends(OAVFeng3dPreView, _super);
        function OAVFeng3dPreView(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVFeng3dPreView";
            _this.alpha = 1;
            return _this;
        }
        OAVFeng3dPreView.prototype.initView = function () {
            if (this.space instanceof feng3d.GameObject) {
                Feng3dScreenShot_1.feng3dScreenShot.drawGameObject(this.space);
            }
            else if (this.space instanceof feng3d.Geometry) {
                Feng3dScreenShot_1.feng3dScreenShot.drawGeometry(this.space);
            }
            else if (this.space instanceof feng3d.Material) {
                Feng3dScreenShot_1.feng3dScreenShot.drawMaterial(this.space);
            }
            this.cameraRotation = Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rotation.clone();
            this.onResize();
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.ticker.on(100, this.onDrawObject, this);
        };
        OAVFeng3dPreView.prototype.dispose = function () {
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.ticker.off(100, this.onDrawObject, this);
        };
        OAVFeng3dPreView.prototype.onMouseDown = function () {
            this.preMousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var s = this.localToGlobal(0, 0);
            if (new feng3d.Rectangle(s.x, s.y, this.width, this.height).containsPoint(this.preMousePos)) {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
        };
        OAVFeng3dPreView.prototype.onMouseMove = function () {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var X_AXIS = Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rightVector;
            var Y_AXIS = Feng3dScreenShot_1.feng3dScreenShot.camera.transform.upVector;
            Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
            Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);
            this.cameraRotation = Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rotation.clone();
            this.preMousePos = mousePos;
        };
        OAVFeng3dPreView.prototype.onDrawObject = function () {
            this.cameraRotation && (Feng3dScreenShot_1.feng3dScreenShot.camera.transform.rotation = this.cameraRotation);
            Feng3dScreenShot_1.feng3dScreenShot.updateCameraPosition();
            this.image.source = Feng3dScreenShot_1.feng3dScreenShot.toDataURL(this.width, this.height);
        };
        OAVFeng3dPreView.prototype.onMouseUp = function () {
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        OAVFeng3dPreView.prototype.updateView = function () {
        };
        OAVFeng3dPreView.prototype.onResize = function () {
            this.height = this.width;
            this.image.width = this.image.height = this.width;
        };
        OAVFeng3dPreView = __decorate([
            feng3d.OAVComponent()
        ], OAVFeng3dPreView);
        return OAVFeng3dPreView;
    }(OAVBase_1.OAVBase));
    exports.OAVFeng3dPreView = OAVFeng3dPreView;
});
//# sourceMappingURL=OAVFeng3dPreView.js.map