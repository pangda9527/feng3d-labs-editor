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
        var Object3DMoveModel = (function (_super) {
            __extends(Object3DMoveModel, _super);
            function Object3DMoveModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.gameObject.name = "Object3DMoveModel";
                _this.initModels();
                return _this;
            }
            Object3DMoveModel.prototype.initModels = function () {
                this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateAxis);
                this.xAxis.color.setTo(1, 0, 0);
                this.xAxis.transform.rz = -90;
                this.gameObject.addChild(this.xAxis.gameObject);
                this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.gameObject.addChild(this.yAxis.gameObject);
                this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateAxis);
                this.zAxis.color.setTo(0, 0, 1);
                this.zAxis.transform.rx = 90;
                this.gameObject.addChild(this.zAxis.gameObject);
                this.yzPlane = feng3d.GameObject.create("yzPlane").addComponent(CoordinatePlane);
                this.yzPlane.color.setTo(1, 0, 0, 0.2);
                this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
                this.yzPlane.borderColor.setTo(1, 0, 0);
                this.yzPlane.transform.rz = 90;
                this.gameObject.addChild(this.yzPlane.gameObject);
                this.xzPlane = feng3d.GameObject.create("xzPlane").addComponent(CoordinatePlane);
                this.xzPlane.color.setTo(0, 1, 0, 0.2);
                this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
                this.xzPlane.borderColor.setTo(0, 1, 0);
                this.gameObject.addChild(this.xzPlane.gameObject);
                this.xyPlane = feng3d.GameObject.create("xyPlane").addComponent(CoordinatePlane);
                this.xyPlane.color.setTo(0, 0, 1, 0.2);
                this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
                this.xyPlane.borderColor.setTo(0, 0, 1);
                this.xyPlane.transform.rx = -90;
                this.gameObject.addChild(this.xyPlane.gameObject);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
                this.gameObject.addChild(this.oCube.gameObject);
            };
            return Object3DMoveModel;
        }(feng3d.Component));
        editor.Object3DMoveModel = Object3DMoveModel;
        var CoordinateAxis = (function (_super) {
            __extends(CoordinateAxis, _super);
            function CoordinateAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this.length = 100;
                _this._selected = false;
                var xLine = feng3d.GameObject.create();
                var segmentGeometry = xLine.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, _this.length, 0));
                segmentGeometry.addSegment(segment);
                _this.segmentMaterial = xLine.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.gameObject.addChild(xLine);
                //
                _this.xArrow = feng3d.GameObject.create();
                _this.xArrow.addComponent(feng3d.MeshFilter).mesh = new feng3d.ConeGeometry(5, 18);
                _this.material = _this.xArrow.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                _this.xArrow.transform.y = _this.length;
                _this.gameObject.addChild(_this.xArrow);
                _this.update();
                var mouseHit = feng3d.GameObject.create("hit");
                mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.CylinderGeometry(5, 5, _this.length - 20);
                mouseHit.transform.y = 20 + (_this.length - 20) / 2;
                mouseHit.visible = false;
                mouseHit.mouseEnabled = true;
                _this.gameObject.addChild(mouseHit);
                return _this;
            }
            Object.defineProperty(CoordinateAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateAxis.prototype.update = function () {
                this.segmentMaterial.color.copyFrom(this.selected ? this.selectedColor : this.color);
                //
                this.material.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateAxis;
        }(feng3d.Component));
        editor.CoordinateAxis = CoordinateAxis;
        var CoordinateCube = (function (_super) {
            __extends(CoordinateCube, _super);
            function CoordinateCube(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 1, 1);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                //
                _this.oCube = feng3d.GameObject.create();
                _this.oCube.addComponent(feng3d.MeshFilter).mesh = new feng3d.CubeGeometry(8, 8, 8);
                _this.colorMaterial = _this.oCube.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                _this.oCube.mouseEnabled = true;
                _this.gameObject.addChild(_this.oCube);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinateCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateCube.prototype.update = function () {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateCube;
        }(feng3d.Component));
        editor.CoordinateCube = CoordinateCube;
        var CoordinatePlane = (function (_super) {
            __extends(CoordinatePlane, _super);
            function CoordinatePlane(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.color = new feng3d.Color(1, 0, 0, 0.2);
                _this.borderColor = new feng3d.Color(1, 0, 0);
                _this.selectedColor = new feng3d.Color(1, 0, 0, 0.5);
                _this.selectedborderColor = new feng3d.Color(1, 1, 0);
                _this._width = 20;
                _this._selected = false;
                var plane = feng3d.GameObject.create("plane");
                plane.transform.x = plane.transform.z = _this._width / 2;
                plane.addComponent(feng3d.MeshFilter).mesh = new feng3d.PlaneGeometry(_this._width, _this._width);
                _this.colorMaterial = plane.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial();
                plane.mouseEnabled = true;
                _this.gameObject.addChild(plane);
                var border = feng3d.GameObject.create("border");
                _this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.gameObject.addChild(border);
                _this.update();
                return _this;
            }
            Object.defineProperty(CoordinatePlane.prototype, "width", {
                //
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinatePlane.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinatePlane.prototype.update = function () {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, 0), new feng3d.Vector3D(this._width, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, 0), new feng3d.Vector3D(this._width, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, this._width), new feng3d.Vector3D(0, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, this._width), new feng3d.Vector3D(0, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
            };
            return CoordinatePlane;
        }(feng3d.Component));
        editor.CoordinatePlane = CoordinatePlane;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DMoveModel.js.map