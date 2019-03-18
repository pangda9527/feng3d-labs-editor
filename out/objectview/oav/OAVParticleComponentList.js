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
define(["require", "exports", "./OAVBase", "../../ui/components/ParticleComponentView"], function (require, exports, OAVBase_1, ParticleComponentView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OAVParticleComponentList = /** @class */ (function (_super) {
        __extends(OAVParticleComponentList, _super);
        function OAVParticleComponentList(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVParticleComponentList";
            return _this;
        }
        Object.defineProperty(OAVParticleComponentList.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
                this.dispose();
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVParticleComponentList.prototype, "attributeName", {
            get: function () {
                return this._attributeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVParticleComponentList.prototype, "attributeValue", {
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
        OAVParticleComponentList.prototype.initView = function () {
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
        };
        OAVParticleComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
        };
        /**
         * 更新界面
         */
        OAVParticleComponentList.prototype.updateView = function () {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof ParticleComponentView_1.ParticleComponentView)
                    child.updateView();
            }
        };
        OAVParticleComponentList.prototype.addComponentView = function (component) {
            var o;
            var displayObject = new ParticleComponentView_1.ParticleComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        };
        OAVParticleComponentList.prototype.removedComponentView = function (component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof ParticleComponentView_1.ParticleComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        };
        OAVParticleComponentList = __decorate([
            feng3d.OAVComponent()
        ], OAVParticleComponentList);
        return OAVParticleComponentList;
    }(OAVBase_1.OAVBase));
    exports.OAVParticleComponentList = OAVParticleComponentList;
});
//# sourceMappingURL=OAVParticleComponentList.js.map