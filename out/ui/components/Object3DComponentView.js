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
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DComponentView = (function (_super) {
            __extends(Object3DComponentView, _super);
            /**
             * 对象界面数据
             */
            function Object3DComponentView(component) {
                var _this = _super.call(this) || this;
                _this.component = component;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Object3DComponentSkin";
                return _this;
            }
            /**
             * 更新界面
             */
            Object3DComponentView.prototype.updateView = function () {
                if (this.componentView)
                    this.componentView.updateView();
            };
            Object3DComponentView.prototype.onComplete = function () {
                var componentName = feng3d.ClassUtils.getQualifiedClassName(this.component).split(".").pop();
                this.accordion.titleName = componentName;
                this.componentView = objectview.getObjectView(this.component);
                this.accordion.addContent(this.componentView);
            };
            return Object3DComponentView;
        }(eui.Component));
        editor.Object3DComponentView = Object3DComponentView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DComponentView.js.map