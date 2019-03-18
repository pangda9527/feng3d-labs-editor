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
define(["require", "exports", "./OAVBase", "../../ui/components/Menu", "../../configs/CommonConfig", "../../ui/drag/Drag", "../../ui/components/ComponentView"], function (require, exports, OAVBase_1, Menu_1, CommonConfig_1, Drag_1, ComponentView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OAVComponentList = /** @class */ (function (_super) {
        __extends(OAVComponentList, _super);
        function OAVComponentList(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVComponentListSkin";
            return _this;
        }
        OAVComponentList.prototype.onAddComponentButtonClick = function () {
            Menu_1.menu.popup(CommonConfig_1.menuConfig.getCreateComponentMenu(this.space));
        };
        Object.defineProperty(OAVComponentList.prototype, "space", {
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
        Object.defineProperty(OAVComponentList.prototype, "attributeName", {
            get: function () {
                return this._attributeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVComponentList.prototype, "attributeValue", {
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
        OAVComponentList.prototype.initView = function () {
            var _this = this;
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
            this.space.on("addComponent", this.onAddCompont, this);
            this.space.on("removeComponent", this.onRemoveComponent, this);
            Drag_1.drag.register(this.addComponentButton, null, ["file_script"], function (dragdata) {
                if (dragdata.file_script) {
                    _this.space.addScript(dragdata.file_script.scriptName);
                }
            });
            this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
            this.space.off("addComponent", this.onAddCompont, this);
            this.space.off("removeComponent", this.onRemoveComponent, this);
            Drag_1.drag.unregister(this.addComponentButton);
            this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.addComponentView = function (component) {
            if (component.hideFlags & feng3d.HideFlags.HideInInspector)
                return;
            var displayObject = new ComponentView_1.ComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        };
        /**
         * 更新界面
         */
        OAVComponentList.prototype.updateView = function () {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof ComponentView_1.ComponentView)
                    child.updateView();
            }
        };
        OAVComponentList.prototype.removedComponentView = function (component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof ComponentView_1.ComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        };
        OAVComponentList.prototype.onAddCompont = function (event) {
            if (event.data.gameObject == this.space)
                this.addComponentView(event.data);
        };
        OAVComponentList.prototype.onRemoveComponent = function (event) {
            if (event.data.gameObject == this.space)
                this.removedComponentView(event.data);
        };
        OAVComponentList = __decorate([
            feng3d.OAVComponent()
        ], OAVComponentList);
        return OAVComponentList;
    }(OAVBase_1.OAVBase));
    exports.OAVComponentList = OAVComponentList;
});
//# sourceMappingURL=OAVComponentList.js.map