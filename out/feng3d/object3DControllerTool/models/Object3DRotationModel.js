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
        var Object3DRotationModel = (function (_super) {
            __extends(Object3DRotationModel, _super);
            function Object3DRotationModel(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.gameObject.name = "Object3DRotationModel";
                _this.initModels();
                return _this;
            }
            Object3DRotationModel.prototype.initModels = function () {
                this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateRotationAxis);
                this.xAxis.color.setTo(1, 0, 0);
                this.xAxis.update();
                this.xAxis.transform.ry = 90;
                this.gameObject.addChild(this.xAxis.gameObject);
                this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateRotationAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.yAxis.update();
                this.yAxis.transform.rx = 90;
                this.gameObject.addChild(this.yAxis.gameObject);
                this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateRotationAxis);
                this.zAxis.color.setTo(0, 0, 1);
                this.zAxis.update();
                this.gameObject.addChild(this.zAxis.gameObject);
                this.cameraAxis = feng3d.GameObject.create("cameraAxis").addComponent(CoordinateRotationAxis);
                this.cameraAxis.color.setTo(1, 1, 1);
                this.zAxis.update();
                this.gameObject.addChild(this.cameraAxis.gameObject);
                this.freeAxis = feng3d.GameObject.create("freeAxis").addComponent(CoordinateRotationFreeAxis);
                this.freeAxis.color.setTo(1, 1, 1);
                this.freeAxis.update();
                this.gameObject.addChild(this.freeAxis.gameObject);
            };
            return Object3DRotationModel;
        }(feng3d.Component));
        editor.Object3DRotationModel = Object3DRotationModel;
        var CoordinateRotationAxis = (function (_super) {
            __extends(CoordinateRotationAxis, _super);
            function CoordinateRotationAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                _this.initModels();
                return _this;
            }
            Object.defineProperty(CoordinateRotationAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateRotationAxis.prototype, "filterNormal", {
                /**
                 * 过滤法线显示某一面线条
                 */
                get: function () { return this._filterNormal; },
                set: function (value) { this._filterNormal = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create();
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                var mouseHit = feng3d.GameObject.create("hit");
                this.torusGeometry = mouseHit.addComponent(feng3d.MeshFilter).mesh = new feng3d.TorusGeometry(this.radius, 2);
                mouseHit.addComponent(feng3d.MeshRenderer).material = new feng3d.StandardMaterial();
                mouseHit.transform.rx = 90;
                mouseHit.visible = false;
                mouseHit.mouseEnabled = true;
                this.gameObject.addChild(mouseHit);
                this.update();
            };
            CoordinateRotationAxis.prototype.update = function () {
                this.sector.radius = this.radius;
                this.torusGeometry.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                if (this._filterNormal) {
                    var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this._filterNormal);
                }
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var show = true;
                        if (localNormal) {
                            show = points[i - 1].dotProduct(localNormal) > 0 && points[i].dotProduct(localNormal) > 0;
                        }
                        if (show) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = color;
                            this.segmentGeometry.addSegment(segment);
                        }
                        else if (this.selected) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = this.backColor;
                            this.segmentGeometry.addSegment(segment);
                        }
                    }
                }
            };
            CoordinateRotationAxis.prototype.showSector = function (startPos, endPos) {
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
                var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
                var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                //
                var min = Math.min(startAngle, endAngle);
                var max = Math.max(startAngle, endAngle);
                if (max - min > 180) {
                    min += 360;
                }
                this.sector.update(min, max);
                this.gameObject.addChild(this.sector.gameObject);
            };
            CoordinateRotationAxis.prototype.hideSector = function () {
                if (this.sector.gameObject.parent)
                    this.sector.gameObject.parent.removeChild(this.sector.gameObject);
            };
            return CoordinateRotationAxis;
        }(feng3d.Component));
        editor.CoordinateRotationAxis = CoordinateRotationAxis;
        /**
         * 扇形对象
         */
        var SectorObject3D = (function (_super) {
            __extends(SectorObject3D, _super);
            /**
             * 构建3D对象
             */
            function SectorObject3D(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.borderColor = new feng3d.Color(0, 1, 1, 0.6);
                _this.radius = 80;
                _this._start = 0;
                _this._end = 0;
                _this.gameObject.name = "sector";
                _this.geometry = _this.gameObject.addComponent(feng3d.MeshFilter).mesh = new feng3d.Geometry();
                _this.gameObject.addComponent(feng3d.MeshRenderer).material = new feng3d.ColorMaterial(new feng3d.Color(0.5, 0.5, 0.5, 0.2));
                var border = feng3d.GameObject.create("border");
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                _this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                _this.gameObject.addChild(border);
                _this.update(0, 0);
                return _this;
            }
            SectorObject3D.prototype.update = function (start, end) {
                if (start === void 0) { start = 0; }
                if (end === void 0) { end = 0; }
                this._start = Math.min(start, end);
                this._end = Math.max(start, end);
                var length = Math.floor(this._end - this._start);
                if (length == 0)
                    length = 1;
                var vertexPositionData = new Float32Array((length + 2) * 3);
                var indices = new Uint16Array(length * 3);
                vertexPositionData[0] = 0;
                vertexPositionData[1] = 0;
                vertexPositionData[2] = 0;
                for (var i = 0; i < length; i++) {
                    vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 5] = 0;
                    if (i > 0) {
                        indices[(i - 1) * 3] = 0;
                        indices[(i - 1) * 3 + 1] = i;
                        indices[(i - 1) * 3 + 2] = i + 1;
                    }
                }
                this.geometry.setVAData("a_position", vertexPositionData, 3);
                this.geometry.setIndices(indices);
                //绘制边界
                var startPoint = new feng3d.Vector3D(this.radius * Math.cos((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                var endPoint = new feng3d.Vector3D(this.radius * Math.cos((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                //
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), startPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(), endPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
            };
            return SectorObject3D;
        }(feng3d.Component));
        editor.SectorObject3D = SectorObject3D;
        var CoordinateRotationFreeAxis = (function (_super) {
            __extends(CoordinateRotationFreeAxis, _super);
            function CoordinateRotationFreeAxis(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6);
                _this.selectedColor = new feng3d.Color(1, 1, 0);
                _this._selected = false;
                _this.initModels();
                return _this;
            }
            Object.defineProperty(CoordinateRotationFreeAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationFreeAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create("border");
                border.addComponent(feng3d.MeshRenderer).material = new feng3d.SegmentMaterial();
                this.segmentGeometry = border.addComponent(feng3d.MeshFilter).mesh = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                this.sector.update(0, 360);
                this.sector.gameObject.visible = false;
                this.sector.gameObject.mouseEnabled = true;
                this.gameObject.addChild(this.sector.gameObject);
                this.update();
            };
            CoordinateRotationFreeAxis.prototype.update = function () {
                this.sector.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var segment = new feng3d.Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = color;
                        this.segmentGeometry.addSegment(segment);
                    }
                }
            };
            return CoordinateRotationFreeAxis;
        }(feng3d.Component));
        editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DRotationModel.js.map