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
        var Accordion = (function (_super) {
            __extends(Accordion, _super);
            function Accordion() {
                var _this = _super.call(this) || this;
                _this.components = [];
                _this.titleName = "";
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "AccordionSkin";
                return _this;
            }
            Accordion.prototype.addContent = function (component) {
                if (!this.contentGroup)
                    this.components.push(component);
                else
                    this.contentGroup.addChild(component);
            };
            Accordion.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Accordion.prototype.onAddedToStage = function () {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                if (this.components) {
                    for (var i = 0; i < this.components.length; i++) {
                        this.contentGroup.addChild(this.components[i]);
                    }
                    this.components = null;
                    delete this.components;
                }
            };
            Accordion.prototype.onRemovedFromStage = function () {
                this.titleButton.removeEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
            };
            Accordion.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            return Accordion;
        }(eui.Component));
        editor.Accordion = Accordion;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Accordion.js.map