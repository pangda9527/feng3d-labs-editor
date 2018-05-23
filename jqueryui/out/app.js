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
/**
 * 默认基础对象界面
 * @author feng 2016-3-11
 */
var OVBaseDefault = /** @class */ (function (_super) {
    __extends(OVBaseDefault, _super);
    function OVBaseDefault(objectViewInfo) {
        var _this = _super.call(this) || this;
        _this.dom = document.createElement("div");
        _this.label = document.createElement("label");
        _this.image = document.createElement("image");
        _this.dom.innerHTML = "<div><span>Type</span><span>source texture</span></div>";
        _this._space = objectViewInfo.owner;
        return _this;
    }
    OVBaseDefault.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.updateView();
    };
    Object.defineProperty(OVBaseDefault.prototype, "space", {
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
    OVBaseDefault.prototype.getAttributeView = function (attributeName) {
        return null;
    };
    OVBaseDefault.prototype.getblockView = function (blockName) {
        return null;
    };
    /**
     * 更新界面
     */
    OVBaseDefault.prototype.updateView = function () {
        this.image.visible = false;
        this.label.visible = true;
        var value = this._space;
        if (typeof value == "string" && value.indexOf("data:") == 0) {
            this.image.visible = true;
            this.label.visible = false;
            this.image.source = value;
        }
        else {
            var string = String(value);
            if (string.length > 1000)
                string = string.substr(0, 1000) + "\n.......";
            this.label.text = string;
        }
    };
    OVBaseDefault = __decorate([
        feng3d.OVComponent()
    ], OVBaseDefault);
    return OVBaseDefault;
}(eui.Component));
// $("body").append(`<input id="autocomplete" title="type &quot;a&quot;">`);
//
feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
feng3d.objectview.defaultObjectViewClass = "OVDefault";
feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
$("body").ready(function () {
    $("body").append("<input id=\"autocomplete\">");
    // $("body").append(`<input id="autocomplete">`).ready(function ()
    // {
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    $("#autocomplete").autocomplete({
        source: availableTags
    });
    // });
});
//# sourceMappingURL=app.js.map