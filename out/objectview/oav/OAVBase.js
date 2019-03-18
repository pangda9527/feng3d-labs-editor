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
var ToolTip_1 = require("../../ui/components/ToolTip");
var OAVBase = /** @class */ (function (_super) {
    __extends(OAVBase, _super);
    function OAVBase(attributeViewInfo) {
        var _this = _super.call(this) || this;
        // 占用，避免出现label命名的组件
        _this.label = "";
        _this._space = attributeViewInfo.owner;
        _this._attributeName = attributeViewInfo.name;
        _this._attributeType = attributeViewInfo.type;
        _this._attributeViewInfo = attributeViewInfo;
        if (!_this._attributeViewInfo.editable)
            _this.alpha = 0.8;
        return _this;
    }
    Object.defineProperty(OAVBase.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            this.dispose();
            this.initView();
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    OAVBase.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        var componentParam = this._attributeViewInfo.componentParam;
        if (componentParam) {
            for (var key in componentParam) {
                if (componentParam.hasOwnProperty(key)) {
                    this[key] = componentParam[key];
                }
            }
        }
        if (this.labelLab) {
            if (this.label)
                this.labelLab.text = this.label;
            else
                this.labelLab.text = this._attributeName;
        }
        if (this._attributeViewInfo.tooltip)
            ToolTip_1.toolTip.register(this.labelLab, this._attributeViewInfo.tooltip);
        this.initView();
        this.updateView();
    };
    OAVBase.prototype.$onRemoveFromStage = function () {
        ToolTip_1.toolTip.unregister(this.labelLab);
        _super.prototype.$onRemoveFromStage.call(this);
        this.dispose();
    };
    /**
     * 初始化
     */
    OAVBase.prototype.initView = function () {
    };
    /**
     * 销毁
     */
    OAVBase.prototype.dispose = function () {
    };
    /**
     * 更新
     */
    OAVBase.prototype.updateView = function () {
    };
    Object.defineProperty(OAVBase.prototype, "attributeName", {
        get: function () {
            return this._attributeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAVBase.prototype, "attributeValue", {
        get: function () {
            return this._space[this._attributeName];
        },
        set: function (value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
                var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                objectViewEvent.space = this._space;
                objectViewEvent.attributeName = this._attributeName;
                objectViewEvent.attributeValue = this.attributeValue;
                this.dispatchEvent(objectViewEvent);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        },
        enumerable: true,
        configurable: true
    });
    return OAVBase;
}(eui.Component));
exports.OAVBase = OAVBase;
//# sourceMappingURL=OAVBase.js.map