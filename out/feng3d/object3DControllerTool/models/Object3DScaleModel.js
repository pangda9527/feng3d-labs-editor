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
        var Object3DScaleModel = (function (_super) {
            __extends(Object3DScaleModel, _super);
            function Object3DScaleModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.gameObject.name = "Object3DScaleModel";
                _this.initModels();
                return _this;
            }
            Object3DScaleModel.prototype.initModels = function () {
                this.xCube = feng3d.GameObject.create("xCube").addComponent(CoordinateScaleCube);
                this.xCube.color.setTo(1, 0, 0);
                this.xCube.update();
                this.xCube.transform.rz = -90;
                this.gameObject.addChild(this.xCube.gameObject);
                this.yCube = feng3d.GameObject.create("yCube").addComponent(CoordinateScaleCube);
                this.yCube.color.setTo(0, 1, 0);
                this.yCube.update();
                this.gameObject.addChild(this.yCube.gameObject);
                this.zCube = feng3d.GameObject.create("zCube").addComponent(CoordinateScaleCube);
                this.zCube.color.setTo(0, 0, 1);
                this.zCube.update();
                this.zCube.transform.rx = 90;
                this.gameObject.addChild(this.zCube.gameObject);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(editor.CoordinateCube);
                this.gameObject.addChild(this.oCube.gameObject);
            };
            return Object3DScaleModel;
        }(feng3d.Component));
        editor.Object3DScaleModel = Object3DScaleModel;
        var CoordinateScaleCube = (function (_super) {
            __extends(CoordinateScaleCube, _super);
            function CoordinateScaleCube(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this.length = 100;
                _this._selected = false;
                _this._scale = 1;
                var xLine = feng3d.GameObject.create();
                xLine.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.segmentGeometry = xLine.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                _this.gameObject.addChild(xLine);
                _this.coordinateCube = feng3d.GameObject.create("coordinateCube").addComponent(editor.CoordinateCube);
                _this.gameObject.addChild(_this.coordinateCube.gameObject);
                var mouseHit = feng3d.GameObject.create("hit");
                mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.CylinderGeometry(5, 5, _this.length - 4);
                mouseHit.addComponent(feng3d.MeshRenderer);
                mouseHit.transform.y = 4 + (_this.length - 4) / 2;
                mouseHit.visible = false;
                mouseHit.mouseEnabled = true;
                _this.gameObject.addChild(mouseHit);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinateScaleCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateScaleCube.prototype, "scaleValue", {
                //
                get: function () { return this._scale; },
                set: function (value) { if (this._scale == value)
                    return; this._scale = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateScaleCube.prototype.update = function () {
                this.coordinateCube.color = this.color;
                this.coordinateCube.selectedColor = this.selectedColor;
                this.coordinateCube.update();
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, this._scale * this.length, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.addSegment(segment);
                //
                this.coordinateCube.transform.y = this.length * this._scale;
                this.coordinateCube.selected = this.selected;
            };
            return CoordinateScaleCube;
        }(feng3d.Component));
        editor.CoordinateScaleCube = CoordinateScaleCube;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DScaleModel.js.map