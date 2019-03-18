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
var defaultTextFiled;
function lostFocus(display) {
    if (!defaultTextFiled) {
        defaultTextFiled = new egret.TextField();
        defaultTextFiled.visible = false;
        display.stage.addChild(defaultTextFiled);
    }
    defaultTextFiled.setFocus();
}
/**
 * 重命名组件
 */
var RenameTextInput = /** @class */ (function (_super) {
    __extends(RenameTextInput, _super);
    function RenameTextInput() {
        var _this = _super.call(this) || this;
        _this.skinName = "RenameTextInputSkin";
        return _this;
    }
    Object.defineProperty(RenameTextInput.prototype, "text", {
        /**
         * 显示文本
         */
        get: function () {
            return this.nameLabel.text;
        },
        set: function (v) {
            this.nameLabel.text = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenameTextInput.prototype, "textAlign", {
        get: function () {
            return this.nameLabel.textAlign;
        },
        set: function (v) {
            this.nameeditTxt.textDisplay.textAlign = this.nameLabel.textAlign = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 启动编辑
     */
    RenameTextInput.prototype.edit = function (callback) {
        this.callback = callback;
        this.textAlign = this.textAlign;
        this.nameeditTxt.text = this.nameLabel.text;
        this.nameLabel.visible = false;
        this.nameeditTxt.visible = true;
        this.nameeditTxt.textDisplay.setFocus();
        //
        this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
        feng3d.windowEventProxy.on("keyup", this.onnameeditChanged, this);
    };
    /**
     * 取消编辑
     */
    RenameTextInput.prototype.cancelEdit = function () {
        this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
        feng3d.windowEventProxy.off("keyup", this.onnameeditChanged, this);
        //
        this.nameeditTxt.visible = false;
        this.nameLabel.visible = true;
        if (this.nameLabel.text == this.nameeditTxt.text)
            return;
        this.nameLabel.text = this.nameeditTxt.text;
        this.callback && this.callback();
        this.callback = null;
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    RenameTextInput.prototype.onnameeditChanged = function () {
        if (feng3d.windowEventProxy.key == "Enter" || feng3d.windowEventProxy.key == "Escape") {
            //拾取焦点
            var inputUtils = this.nameeditTxt.textDisplay["inputUtils"];
            inputUtils["onStageDownHandler"](new egret.Event(""));
        }
    };
    return RenameTextInput;
}(eui.Component));
//# sourceMappingURL=RenameTextInput.js.map