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
var editor;
(function (editor) {
    var OAVVector3D = /** @class */ (function (_super) {
        __extends(OAVVector3D, _super);
        function OAVVector3D(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVVector3DSkin";
            return _this;
        }
        OAVVector3D.prototype.initView = function () {
            this.vector3DView.vm = this.attributeValue;
            eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
        };
        OAVVector3D.prototype.dispose = function () {
            // this.vector3DView.vm = <any>this.attributeValue;
            // eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
        };
        OAVVector3D = __decorate([
            feng3d.OAVComponent()
        ], OAVVector3D);
        return OAVVector3D;
    }(OAVBase));
    editor.OAVVector3D = OAVVector3D;
})(editor || (editor = {}));
//# sourceMappingURL=OAVVector3D.js.map