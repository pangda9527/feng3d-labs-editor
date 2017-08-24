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
        var OAVObject3DComponentList = (function (_super) {
            __extends(OAVObject3DComponentList, _super);
            function OAVObject3DComponentList(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this.accordions = [];
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVObject3DComponentListSkin";
                return _this;
            }
            OAVObject3DComponentList.prototype.onComplete = function () {
                this.addComponentButton.addEventListener(editor.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
                this.initView();
            };
            OAVObject3DComponentList.prototype.onAddComponentButtonClick = function () {
                var globalPoint = this.addComponentButton.localToGlobal(0, 0);
                editor.createObject3DView.showView(createObject3DComponentConfig, this.onCreateComponent.bind(this), globalPoint);
            };
            OAVObject3DComponentList.prototype.onCreateComponent = function (item) {
                var cls = feng3d.ClassUtils.getDefinitionByName(item.className);
                var component = this.space.addComponent(cls);
                this.addComponentView(component);
            };
            Object.defineProperty(OAVObject3DComponentList.prototype, "space", {
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
            Object.defineProperty(OAVObject3DComponentList.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVObject3DComponentList.prototype, "attributeValue", {
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
            OAVObject3DComponentList.prototype.initView = function () {
                this.accordions.length = 0;
                this.group.layout.gap = -1;
                var components = this.attributeValue;
                for (var i = 0; i < components.length; i++) {
                    this.addComponentView(components[i]);
                }
            };
            OAVObject3DComponentList.prototype.addComponentView = function (component) {
                var displayObject = new editor.Object3DComponentView(component);
                displayObject.percentWidth = 100;
                this.group.addChild(displayObject);
                //
                displayObject.deleteButton.addEventListener(editor.MouseEvent.CLICK, this.onDeleteButton, this);
            };
            /**
             * 更新界面
             */
            OAVObject3DComponentList.prototype.updateView = function () {
                for (var i = 0, n = this.group.numChildren; i < n; i++) {
                    var child = this.group.getChildAt(i);
                    if (child instanceof editor.Object3DComponentView)
                        child.updateView();
                }
            };
            OAVObject3DComponentList.prototype.onDeleteButton = function (event) {
                var displayObject = event.currentTarget.parent;
                this.group.removeChild(displayObject);
                this.space.removeComponent(displayObject.component);
            };
            OAVObject3DComponentList = __decorate([
                OVAComponent()
            ], OAVObject3DComponentList);
            return OAVObject3DComponentList;
        }(eui.Component));
        editor.OAVObject3DComponentList = OAVObject3DComponentList;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=OAVObject3DComponentList.js.map