"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Main3D_1 = require("../feng3d/Main3D");
var NavigationProcess = /** @class */ (function () {
    function NavigationProcess(geometry) {
        this.data = new NavigationData();
        this.data.init(geometry);
    }
    NavigationProcess.prototype.checkMaxSlope = function (maxSlope) {
        var _this = this;
        var up = new feng3d.Vector3(0, 1, 0);
        var mincos = Math.cos(maxSlope * feng3d.FMath.DEG2RAD);
        var keys = this.data.trianglemap.getKeys();
        keys.forEach(function (element) {
            var normal = _this.data.trianglemap.get(element).getNormal();
            var dot = normal.dot(up);
            if (dot < mincos) {
                _this.data.trianglemap.delete(element);
            }
        });
    };
    NavigationProcess.prototype.checkAgentRadius = function (agentRadius) {
        var trianglemap = this.data.trianglemap;
        var linemap = this.data.linemap;
        var pointmap = this.data.pointmap;
        var line0map = new Map();
        //获取所有独立边
        var lines = this.getAllSingleLine();
        //调试独立边
        this.debugShowLines(lines);
        // 计算创建边缘边
        var line0s = lines.map(createLine0);
        // 调试边缘边内部方向
        this.debugShowLines1(line0s, agentRadius);
        // 方案1：遍历每个点，使得该点对所有边缘边保持大于agentRadius的距离
        // pointmap.getValues().forEach(handlePoint);
        // 方案2：遍历所有边缘边，把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上，
        line0s.forEach(handleLine0);
        trianglemap.getValues().forEach(function (triangle) {
            if (triangle.getNormal().dot(new feng3d.Vector3(0, 1, 0)) < 0)
                trianglemap.delete(triangle.index);
        }); //删除面向-y方向的三角形
        // 方案3：在原有模型上减去 以独立边为轴以agentRadius为半径的圆柱（此处需要基于模型之间的剔除等运算）
        /**
         * 把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上
         * @param line0
         */
        function handleLine0(line0) {
            // 三条线段
            var ls = line0map.get(line0.leftline).segment;
            var cs = line0.segment;
            var rs = line0map.get(line0.rightline).segment;
            //
            var ld = line0map.get(line0.leftline).direction;
            var cd = line0.direction;
            var rd = line0map.get(line0.rightline).direction;
            // 顶点坐标
            var p0 = [ls.p0, ls.p1].filter(function (p) { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
            var p1 = [ls.p0, ls.p1].filter(function (p) { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
            var p2 = [rs.p0, rs.p1].filter(function (p) { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
            var p3 = [rs.p0, rs.p1].filter(function (p) { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
            // 角平分线上点坐标
            var lp = getHalfAnglePoint(p1, ld, cd, agentRadius);
            var rp = getHalfAnglePoint(p2, cd, rd, agentRadius);
            //debug
            pointGeometry.points.push({ position: lp });
            pointGeometry.points.push({ position: rp });
            pointGeometry.invalidateGeometry();
            //
            var hpmap = {};
            var points = linemap.get(line0.index).points.concat();
            handlePoints();
            function handlePoints() {
                if (points.length == 0)
                    return;
                var point = pointmap.get(points.shift());
                //
                var ld = ls.getPointDistance(point.getPoint());
                var cd = cs.getPointDistance(point.getPoint());
                var rd = rs.getPointDistance(point.getPoint());
                //
                if (cd < agentRadius) {
                    if (ld < agentRadius) //处理左夹角内点点
                     {
                        point.setPoint(lp);
                    }
                    else if (rd < agentRadius) //处理右夹角内点点
                     {
                        point.setPoint(rp);
                    }
                    else {
                        point.setPoint(point.getPoint().addTo(line0.direction.clone().scaleNumber(agentRadius - cd)));
                    }
                    //标记该点以被处理
                    hpmap[point.index] = true;
                    // 搜索临近点
                    point.getNearbyPoints().forEach(function (p) {
                        if (hpmap[p])
                            return;
                        if (points.indexOf(p) != -1)
                            return;
                        points.push(p);
                    });
                }
                handlePoints();
            }
            /**
             * 获取对角线上距离角的两边距离为 distance 的点
             * @param pa 角的第一个点
             * @param d1 角点
             * @param d2 角的第二个点
             * @param distance 距离
             */
            function getHalfAnglePoint(p0, d1, d2, distance) {
                //对角线方向
                var djx = d1.addTo(d2).normalize();
                var cos = djx.dot(d1);
                var targetPoint = p0.addTo(djx.clone().normalize(distance / cos));
                return targetPoint;
            }
        }
        /**
         * 使得该点对所有边缘边保持大于agentRadius的距离
         * @param point
         */
        function handlePoint(point) {
            var p = point.getPoint();
            var crossline0s = line0s.reduce(function (result, line0) {
                var distance = line0.segment.getPointDistance(p);
                if (distance < agentRadius) {
                    result.push([line0, distance]);
                }
                return result;
            }, []);
            if (crossline0s.length == 0)
                return;
            if (crossline0s.length == 1) {
                point.setPoint(point.getPoint().addTo(crossline0s[0][0].direction.clone().scaleNumber(agentRadius - crossline0s[0][1])));
            }
            else {
                //如果多于两条线段，取距离最近两条
                if (crossline0s.length > 2) {
                    crossline0s.sort(function (a, b) { return a[1] - b[1]; });
                }
                //对角线方向
                var djx = crossline0s[0][0].direction.addTo(crossline0s[1][0].direction).normalize();
                //查找两条线段的共同点
                var points0 = linemap.get(crossline0s[0][0].index).points;
                var points1 = linemap.get(crossline0s[1][0].index).points;
                var ps = points0.filter(function (v) { return points1.indexOf(v) != -1; });
                if (ps.length == 1) {
                    var cross = pointmap.get(ps[0]).getPoint();
                    var cos = djx.dot(crossline0s[0][0].segment.p1.subTo(crossline0s[0][0].segment.p0).normalize());
                    var sin = Math.sqrt(1 - cos * cos);
                    var length = agentRadius / sin;
                    var targetPoint = cross.addTo(djx.clone().scaleNumber(length));
                    point.setPoint(targetPoint);
                }
                else {
                    ps.length;
                }
            }
        }
        /**
         * 创建边缘边
         * @param line
         */
        function createLine0(line) {
            var line0 = new Line0();
            line0.index = line.index;
            var points = line.points.map(function (v) { var point = pointmap.get(v); return new feng3d.Vector3(point.value[0], point.value[1], point.value[2]); });
            line0.segment = new feng3d.Segment3D(points[0], points[1]);
            //
            var triangle = trianglemap.get(line.triangles[0]);
            if (!triangle)
                return;
            var linepoints = line.points.map(function (v) { return pointmap.get(v); });
            var otherPoint = pointmap.get(triangle.points.filter(function (v) {
                return line.points.indexOf(v) == -1;
            })[0]).getPoint();
            line0.direction = line0.segment.getNormalWithPoint(otherPoint);
            line0.leftline = pointmap.get(line.points[0]).lines.filter(function (line) {
                if (line == line0.index)
                    return false;
                var prelines = lines.filter(function (l) {
                    return l.index == line;
                });
                return prelines.length == 1;
            })[0];
            line0.rightline = pointmap.get(line.points[1]).lines.filter(function (line) {
                if (line == line0.index)
                    return false;
                var prelines = lines.filter(function (l) {
                    return l.index == line;
                });
                return prelines.length == 1;
            })[0];
            line0map.set(line0.index, line0);
            return line0;
        }
    };
    NavigationProcess.prototype.checkAgentHeight = function (agentHeight) {
        this.data.resetData();
        //
        var pointmap = this.data.pointmap;
        var linemap = this.data.linemap;
        var trianglemap = this.data.trianglemap;
        //
        var triangle0s = trianglemap.getValues().map(createTriangle);
        pointmap.getValues().forEach(handlePoint);
        //
        function createTriangle(triangle) {
            var triangle3D = triangle.getTriangle3D();
            return { triangle3D: triangle3D, index: triangle.index };
        }
        //
        function handlePoint(point) {
            // 测试点是否通过所有三角形测试
            var result = triangle0s.every(function (triangle0) {
                return true;
            });
            // 测试失败时删除该点关联的三角形
            if (!result) {
                point.triangles.forEach(function (triangleindex) {
                    trianglemap.delete(triangleindex);
                });
            }
        }
    };
    NavigationProcess.prototype.getGeometry = function () {
        return this.data.getGeometry();
    };
    NavigationProcess.prototype.debugShowLines1 = function (line0s, length) {
        var segments = [];
        line0s.forEach(function (element) {
            var p0 = element.segment.p0.addTo(element.segment.p1).scaleNumber(0.5);
            var p1 = p0.addTo(element.direction.clone().normalize(length));
            segments.push({ start: p0, end: p1, startColor: new feng3d.Color4(1), endColor: new feng3d.Color4(0, 1) });
        });
        segmentGeometry.segments = segments;
    };
    NavigationProcess.prototype.debugShowLines = function (lines) {
        var _this = this;
        createSegment();
        var segments = [];
        lines.forEach(function (element) {
            var points = element.points.map(function (pointindex) {
                var value = _this.data.pointmap.get(pointindex).value;
                return new feng3d.Vector3(value[0], value[1], value[2]);
            });
            segments.push({ start: points[0], end: points[1] });
        });
        segmentGeometry.segments = segments;
    };
    /**
     * 获取所有独立边
     */
    NavigationProcess.prototype.getAllSingleLine = function () {
        var _this = this;
        var lines = [];
        var needLine = [];
        this.data.linemap.forEach(function (element) {
            element.triangles = element.triangles.filter(function (triangleIndex) { return _this.data.trianglemap.has(triangleIndex); });
            if (element.triangles.length == 1)
                lines.push(element);
            else if (element.triangles.length == 0)
                needLine.push(element);
        });
        needLine.forEach(function (element) {
            _this.data.linemap.delete(element.index);
        });
        return lines;
    };
    return NavigationProcess;
}());
exports.NavigationProcess = NavigationProcess;
/**
 * 点
 */
var Point = /** @class */ (function () {
    function Point(pointmap, linemap, trianglemap) {
        /**
         * 点连接的线段索引列表
         */
        this.lines = [];
        /**
         * 点连接的三角形索引列表
         */
        this.triangles = [];
        this.pointmap = pointmap;
        this.linemap = linemap;
        this.trianglemap = trianglemap;
    }
    /**
     * 设置该点位置
     * @param p
     */
    Point.prototype.setPoint = function (p) {
        this.value = [p.x, p.y, p.z];
    };
    /**
     * 获取该点位置
     */
    Point.prototype.getPoint = function () {
        return new feng3d.Vector3(this.value[0], this.value[1], this.value[2]);
    };
    /**
     * 获取相邻点索引列表
     */
    Point.prototype.getNearbyPoints = function () {
        var _this = this;
        var points = this.triangles.reduce(function (points, triangleid) {
            var triangle = _this.trianglemap.get(triangleid);
            if (!triangle)
                return points;
            triangle.points.forEach(function (point) {
                if (point != _this.index)
                    points.push(point);
            });
            return points;
        }, []);
        return points;
    };
    return Point;
}());
/**
 * 边
 */
var Line = /** @class */ (function () {
    function Line() {
        /**
         * 线段连接的三角形索引列表
         */
        this.triangles = [];
    }
    return Line;
}());
/**
 * 三角形
 */
var Triangle = /** @class */ (function () {
    function Triangle(pointmap, linemap, trianglemap) {
        /**
         * 包含的三个边索引
         */
        this.lines = [];
        this.pointmap = pointmap;
        this.linemap = linemap;
        this.trianglemap = trianglemap;
    }
    Triangle.prototype.getTriangle3D = function () {
        var _this = this;
        var points = [];
        this.points.forEach(function (element) {
            var pointvalue = _this.pointmap.get(element).value;
            points.push(new feng3d.Vector3(pointvalue[0], pointvalue[1], pointvalue[2]));
        });
        var triangle3D = new feng3d.Triangle3D(points[0], points[1], points[2]);
        return triangle3D;
    };
    /**
     * 获取法线
     */
    Triangle.prototype.getNormal = function () {
        var normal = this.getTriangle3D().getNormal();
        return normal;
    };
    return Triangle;
}());
/**
 * 边
 */
var Line0 = /** @class */ (function () {
    function Line0() {
    }
    return Line0;
}());
var NavigationData = /** @class */ (function () {
    function NavigationData() {
    }
    NavigationData.prototype.init = function (geometry) {
        var positions = geometry.positions;
        var indices = geometry.indices;
        feng3d.assert(indices.length % 3 == 0);
        var pointmap = this.pointmap = new Map();
        var linemap = this.linemap = new Map();
        var trianglemap = this.trianglemap = new Map();
        // 合并相同点
        var pointAutoIndex = 0;
        var pointcache = {};
        var pointindexmap = {}; //通过点原来索引映射到新索引
        //
        var lineAutoIndex = 0;
        var linecache = {};
        //
        for (var i = 0, n = positions.length; i < n; i += 3) {
            var point = createPoint(positions[i], positions[i + 1], positions[i + 2]);
            pointindexmap[i / 3] = point.index;
        }
        indices = indices.map(function (pointindex) { return pointindexmap[pointindex]; });
        //
        for (var i = 0, n = indices.length; i < n; i += 3) {
            var triangle = new Triangle(pointmap, linemap, trianglemap);
            triangle.index = i / 3;
            triangle.points = [indices[i], indices[i + 1], indices[i + 2]];
            trianglemap.set(triangle.index, triangle);
            //
            pointmap.get(indices[i]).triangles.push(triangle.index);
            pointmap.get(indices[i + 1]).triangles.push(triangle.index);
            pointmap.get(indices[i + 2]).triangles.push(triangle.index);
            //
            var points = triangle.points.concat().sort().map(function (value) { return pointmap.get(value); });
            createLine(points[0], points[1], triangle);
            createLine(points[0], points[2], triangle);
            createLine(points[1], points[2], triangle);
        }
        function createLine(point0, point1, triangle) {
            linecache[point0.index] = linecache[point0.index] || {};
            var line = linecache[point0.index][point1.index];
            if (!line) {
                line = linecache[point0.index][point1.index] = new Line();
                line.index = lineAutoIndex++;
                line.points = [point0.index, point1.index];
                linemap.set(line.index, line);
                //
                point0.lines.push(line.index);
                point1.lines.push(line.index);
            }
            line.triangles.push(triangle.index);
            //
            triangle.lines.push(line.index);
        }
        function createPoint(x, y, z) {
            var xs = x.toPrecision(6);
            var ys = y.toPrecision(6);
            var zs = z.toPrecision(6);
            pointcache[xs] = pointcache[xs] || {};
            pointcache[xs][ys] = pointcache[xs][ys] || {};
            var point = pointcache[xs][ys][zs];
            if (!point) {
                point = pointcache[xs][ys][zs] = new Point(pointmap, linemap, trianglemap);
                point.index = pointAutoIndex++;
                point.value = [x, y, z];
                pointmap.set(point.index, point);
            }
            return point;
        }
    };
    NavigationData.prototype.getGeometry = function () {
        var _this = this;
        var positions = [];
        var pointIndexMap = new Map();
        var autoId = 0;
        var indices = [];
        this.trianglemap.forEach(function (element) {
            var points = element.points.map(function (pointIndex) {
                if (pointIndexMap.has(pointIndex)) {
                    return pointIndexMap.get(pointIndex);
                }
                positions.push.apply(positions, _this.pointmap.get(pointIndex).value);
                pointIndexMap.set(pointIndex, autoId++);
                return autoId - 1;
            });
            indices.push.apply(indices, points);
        });
        return { positions: positions, indices: indices };
    };
    NavigationData.prototype.resetData = function () {
        var geometry = this.getGeometry();
        this.clearData();
        this.init(geometry);
    };
    NavigationData.prototype.clearData = function () {
        this.pointmap.forEach(function (point) {
            point.pointmap = point.linemap = point.trianglemap = null;
        });
        this.pointmap.clear();
        this.linemap.forEach(function (line) {
        });
        this.linemap.clear();
        this.trianglemap.forEach(function (triangle) {
        });
        this.trianglemap.clear();
    };
    return NavigationData;
}());
var segmentGeometry;
var debugSegment;
//
var pointGeometry;
var debugPoint;
function createSegment() {
    var parentobject = Main3D_1.engine.root.find("editorObject") || Main3D_1.engine.root;
    if (!debugSegment) {
        debugSegment = Object.setValue(new feng3d.GameObject(), { name: "segment" });
        debugSegment.mouseEnabled = false;
        //初始化材质
        var model = debugSegment.addComponent(feng3d.Model);
        var material = model.material = Object.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1.0, 0, 0) },
        });
        segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
    }
    parentobject.addChild(debugSegment);
    //
    if (!debugPoint) {
        debugPoint = Object.setValue(new feng3d.GameObject(), { name: "points" });
        debugPoint.mouseEnabled = false;
        var model = debugPoint.addComponent(feng3d.Model);
        pointGeometry = model.geometry = new feng3d.PointGeometry();
        var materialp = model.material = Object.setValue(new feng3d.Material(), {
            shaderName: "point", renderParams: { renderMode: feng3d.RenderMode.POINTS },
            uniforms: { u_PointSize: 5, u_color: new feng3d.Color4() },
        });
    }
    pointGeometry.points = [];
    parentobject.addChild(debugPoint);
}
//# sourceMappingURL=NavigationProcess.js.map