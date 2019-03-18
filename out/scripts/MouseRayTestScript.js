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
var EditorScript_1 = require("./EditorScript");
var Main3D_1 = require("../feng3d/Main3D");
var MouseRayTestScript = /** @class */ (function (_super) {
    __extends(MouseRayTestScript, _super);
    function MouseRayTestScript() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseRayTestScript.prototype.init = function (gameObject) {
        _super.prototype.init.call(this, gameObject);
        feng3d.windowEventProxy.on("click", this.onclick, this);
    };
    MouseRayTestScript.prototype.onclick = function () {
        var gameobject = Object.setValue(new feng3d.GameObject(), { name: "test" });
        var model = gameobject.addComponent(feng3d.Model);
        model.material = new feng3d.Material();
        model.geometry = Object.setValue(new feng3d.SphereGeometry(), { radius: 10 });
        gameobject.mouseEnabled = false;
        var mouseRay3D = Main3D_1.engine.camera.getMouseRay3D();
        this.gameObject.addChild(gameobject);
        var position = mouseRay3D.position.clone();
        var direction = mouseRay3D.direction.clone();
        position = gameobject.transform.inverseTransformPoint(position);
        direction = gameobject.transform.inverseTransformDirection(direction);
        gameobject.transform.position = position;
        var num = 1000;
        var translate = function () {
            gameobject.transform.translate(direction, 15);
            if (num > 0) {
                setTimeout(function () {
                    translate();
                }, 1000 / 60);
            }
            else {
                gameobject.remove();
            }
            num--;
        };
        translate();
    };
    MouseRayTestScript.prototype.update = function () {
    };
    /**
     * 销毁
     */
    MouseRayTestScript.prototype.dispose = function () {
        feng3d.windowEventProxy.off("click", this.onclick, this);
    };
    return MouseRayTestScript;
}(EditorScript_1.EditorScript));
exports.MouseRayTestScript = MouseRayTestScript;
//# sourceMappingURL=MouseRayTestScript.js.map