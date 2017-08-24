var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVVector3D = (function (_super) {
            __extends(OAVVector3D, _super);
            function OAVVector3D(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVVector3DSkin";
                return _this;
            }
            OAVVector3D.prototype.onComplete = function () {
                this.vector3DView.vm = this.attributeValue;
                eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
                this.updateView();
            };
            Object.defineProperty(OAVVector3D.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OAVVector3D.prototype.updateView = function () {
            };
            OAVVector3D = __decorate([
                OVAComponent()
            ], OAVVector3D);
            return OAVVector3D;
        }(eui.Component));
        editor.OAVVector3D = OAVVector3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=OAVVector3D.js.map