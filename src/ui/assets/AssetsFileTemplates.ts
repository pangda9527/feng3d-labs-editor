namespace feng3d.editor
{
    export var assetsFileTemplates = {
        NewScript:
            `namespace feng3d
{
    export class NewScript extends Script
    {
        /**
         * 初始化时调用
         */
        init()
        {

        }

        /**
         * 更新
         */
        update()
        {
            log(this.transform.position);
        }

        /**
         * 销毁时调用
         */
        dispose()
        {

        }
    }
}`,
scriptCompile:
`var __extends = (this && this.__extends) || (function () {
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
    var NewScript = /** @class */ (function (_super) {
        __extends(NewScript, _super);
        function NewScript() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 初始化时调用
         */
        NewScript.prototype.init = function () {
        };
        /**
         * 更新
         */
        NewScript.prototype.update = function () {
            feng3d.log(this.transform.position);
        };
        /**
         * 销毁时调用
         */
        NewScript.prototype.dispose = function () {
        };
        return NewScript;
    }(feng3d.Script));
    feng3d.NewScript = NewScript;
})(feng3d || (feng3d = {}));
`
    };
}