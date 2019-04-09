namespace navigation
{
    export class NavigationProcess
    {
        private data: NavigationData;

        constructor(geometry: { positions: number[], indices: number[] })
        {
            this.data = new NavigationData();
            this.data.init(geometry);
        }

        checkMaxSlope(maxSlope: number)
        {
            var up = new feng3d.Vector3(0, 1, 0);
            var mincos = Math.cos(maxSlope * feng3d.FMath.DEG2RAD);

            var keys = this.data.trianglemap.getKeys();
            keys.forEach(element =>
            {
                var normal = this.data.trianglemap.get(element).getNormal();
                var dot = normal.dot(up);
                if (dot < mincos)
                {
                    this.data.trianglemap.delete(element);
                }
            });
        }

        checkAgentRadius(agentRadius: number)
        {
            var trianglemap = this.data.trianglemap;
            var linemap = this.data.linemap;
            var pointmap = this.data.pointmap;
            var line0map = new Map<number, Line0>();

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
            trianglemap.getValues().forEach(triangle =>
            {
                if (triangle.getNormal().dot(new feng3d.Vector3(0, 1, 0)) < 0)
                    trianglemap.delete(triangle.index);
            }); //删除面向-y方向的三角形

            // 方案3：在原有模型上减去 以独立边为轴以agentRadius为半径的圆柱（此处需要基于模型之间的剔除等运算）

            /**
             * 把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上
             * @param line0 
             */
            function handleLine0(line0: Line0)
            {
                // 三条线段
                var ls = line0map.get(line0.leftline).segment;
                var cs = line0.segment;
                var rs = line0map.get(line0.rightline).segment;
                //
                var ld = line0map.get(line0.leftline).direction;
                var cd = line0.direction;
                var rd = line0map.get(line0.rightline).direction;
                // 顶点坐标
                var p0 = [ls.p0, ls.p1].filter((p) => { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                var p1 = [ls.p0, ls.p1].filter((p) => { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p2 = [rs.p0, rs.p1].filter((p) => { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p3 = [rs.p0, rs.p1].filter((p) => { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                // 角平分线上点坐标
                var lp = getHalfAnglePoint(p1, ld, cd, agentRadius);
                var rp = getHalfAnglePoint(p2, cd, rd, agentRadius);
                //debug
                pointGeometry.points.push({ position: lp });
                pointGeometry.points.push({ position: rp });
                pointGeometry.invalidateGeometry();
                //
                var hpmap: { [point: number]: true } = {};
                var points = linemap.get(line0.index).points.concat();
                handlePoints();

                function handlePoints()
                {
                    if (points.length == 0)
                        return;

                    var point = pointmap.get(points.shift());
                    //
                    var ld = ls.getPointDistance(point.getPoint());
                    var cd = cs.getPointDistance(point.getPoint());
                    var rd = rs.getPointDistance(point.getPoint());
                    //
                    if (cd < agentRadius) 
                    {
                        if (ld < agentRadius) //处理左夹角内点点
                        {
                            point.setPoint(lp);
                        } else if (rd < agentRadius)    //处理右夹角内点点
                        {
                            point.setPoint(rp);
                        } else
                        {
                            point.setPoint(point.getPoint().addTo(line0.direction.clone().scaleNumber(agentRadius - cd)));
                        }
                        //标记该点以被处理
                        hpmap[point.index] = true;
                        // 搜索临近点
                        point.getNearbyPoints().forEach((p) =>
                        {
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
                function getHalfAnglePoint(p0: feng3d.Vector3, d1: feng3d.Vector3, d2: feng3d.Vector3, distance: number)
                {
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
            function handlePoint(point: Point)
            {
                var p = point.getPoint();
                var crossline0s: [Line0, number][] = line0s.reduce((result, line0) =>
                {
                    var distance = line0.segment.getPointDistance(p);
                    if (distance < agentRadius)
                    {
                        result.push([line0, distance]);
                    }
                    return result;
                }, []);
                if (crossline0s.length == 0)
                    return;
                if (crossline0s.length == 1)
                {
                    point.setPoint(point.getPoint().addTo(crossline0s[0][0].direction.clone().scaleNumber(agentRadius - crossline0s[0][1])));
                } else 
                {
                    //如果多于两条线段，取距离最近两条
                    if (crossline0s.length > 2)
                    {
                        crossline0s.sort((a, b) => { return a[1] - b[1] })
                    }
                    //对角线方向
                    var djx = crossline0s[0][0].direction.addTo(crossline0s[1][0].direction).normalize();
                    //查找两条线段的共同点
                    var points0 = linemap.get(crossline0s[0][0].index).points;
                    var points1 = linemap.get(crossline0s[1][0].index).points;
                    var ps = points0.filter((v) => { return points1.indexOf(v) != -1; });
                    if (ps.length == 1)
                    {
                        var cross = pointmap.get(ps[0]).getPoint();
                        var cos = djx.dot(crossline0s[0][0].segment.p1.subTo(crossline0s[0][0].segment.p0).normalize());
                        var sin = Math.sqrt(1 - cos * cos);
                        var length = agentRadius / sin;
                        var targetPoint = cross.addTo(djx.clone().scaleNumber(length));
                        point.setPoint(targetPoint);
                    } else
                    {
                        ps.length;
                    }
                }
            }

            /**
             * 创建边缘边
             * @param line 
             */
            function createLine0(line: Line)
            {
                var line0 = new Line0();
                line0.index = line.index;
                var points = line.points.map((v) => { var point = pointmap.get(v); return new feng3d.Vector3(point.value[0], point.value[1], point.value[2]); })
                line0.segment = new feng3d.Segment3D(points[0], points[1]);
                //
                var triangle = trianglemap.get(line.triangles[0]);
                if (!triangle)
                    return;
                var linepoints = line.points.map((v) => { return pointmap.get(v); })
                var otherPoint = pointmap.get(triangle.points.filter((v) =>
                {
                    return line.points.indexOf(v) == -1;
                })[0]).getPoint();
                line0.direction = line0.segment.getNormalWithPoint(otherPoint);
                line0.leftline = pointmap.get(line.points[0]).lines.filter((line) =>
                {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter((l) =>
                    {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0.rightline = pointmap.get(line.points[1]).lines.filter((line) =>
                {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter((l) =>
                    {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0map.set(line0.index, line0);
                return line0;
            }
        }

        checkAgentHeight(agentHeight: number)
        {
            this.data.resetData();
            //
            var pointmap = this.data.pointmap;
            var linemap = this.data.linemap;
            var trianglemap = this.data.trianglemap;
            //
            var triangle0s = trianglemap.getValues().map(createTriangle);
            pointmap.getValues().forEach(handlePoint);

            //
            function createTriangle(triangle: Triangle)
            {
                var triangle3D = triangle.getTriangle3D();
                return { triangle3D: triangle3D, index: triangle.index };
            }
            //
            function handlePoint(point: Point)
            {
                // 测试点是否通过所有三角形测试
                var result = triangle0s.every(triangle0 =>
                {


                    return true;
                });
                // 测试失败时删除该点关联的三角形
                if (!result)
                {
                    point.triangles.forEach(triangleindex =>
                    {
                        trianglemap.delete(triangleindex);
                    });
                }
            }
        }

        getGeometry()
        {
            return this.data.getGeometry();
        }

        private debugShowLines1(line0s: Line0[], length: number)
        {
            var segments: feng3d.Segment[] = [];
            line0s.forEach(element =>
            {
                var p0 = element.segment.p0.addTo(element.segment.p1).scaleNumber(0.5);
                var p1 = p0.addTo(element.direction.clone().normalize(length));
                segments.push({ start: p0, end: p1, startColor: new feng3d.Color4(1), endColor: new feng3d.Color4(0, 1) });
            });
            segmentGeometry.segments = segments;
        }

        private debugShowLines(lines: Line[])
        {
            createSegment();
            var segments: feng3d.Segment[] = [];
            lines.forEach(element =>
            {
                var points = element.points.map((pointindex) =>
                {
                    var value = this.data.pointmap.get(pointindex).value;
                    return new feng3d.Vector3(value[0], value[1], value[2]);
                });
                segments.push({ start: points[0], end: points[1] });
            });
            segmentGeometry.segments = segments;
        }

        /**
         * 获取所有独立边
         */
        private getAllSingleLine()
        {
            var lines: Line[] = [];
            var needLine: Line[] = [];
            this.data.linemap.forEach(element =>
            {
                element.triangles = element.triangles.filter((triangleIndex) => { return this.data.trianglemap.has(triangleIndex); });
                if (element.triangles.length == 1)
                    lines.push(element);
                else if (element.triangles.length == 0)
                    needLine.push(element);
            });
            needLine.forEach(element =>
            {
                this.data.linemap.delete(element.index);
            });
            return lines;
        }
    }

    /**
     * 点
     */
    class Point
    {
        /**
         * 点索引
         */
        index: number;
        /**
         * 点的值，xyz
         */
        value: [number, number, number];
        /**
         * 点连接的线段索引列表
         */
        lines: number[] = [];
        /**
         * 点连接的三角形索引列表
         */
        triangles: number[] = [];

        //
        pointmap: Map<number, Point>;
        linemap: Map<number, Line>;
        trianglemap: Map<number, Triangle>;

        constructor(pointmap, linemap, trianglemap)
        {
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }

        /**
         * 设置该点位置
         * @param p 
         */
        setPoint(p: feng3d.Vector3)
        {
            this.value = [p.x, p.y, p.z];
        }

        /**
         * 获取该点位置
         */
        getPoint()
        {
            return new feng3d.Vector3(this.value[0], this.value[1], this.value[2]);
        }

        /**
         * 获取相邻点索引列表
         */
        getNearbyPoints()
        {
            var points = this.triangles.reduce((points: number[], triangleid) =>
            {
                var triangle = this.trianglemap.get(triangleid);
                if (!triangle)
                    return points;
                triangle.points.forEach(point =>
                {
                    if (point != this.index)
                        points.push(point);
                });
                return points;
            }, []);
            return points;
        }
    }

    /**
     * 边
     */
    class Line
    {
        /**
         * 线段索引
         */
        index: number;
        /**
         * 线段两端点索引
         */
        points: [number, number];
        /**
         * 线段连接的三角形索引列表
         */
        triangles: number[] = [];
    }

    /**
     * 三角形
     */
    class Triangle
    {
        /**
         * 索引
         */
        index: number;
        /**
         * 包含的三个点索引
         */
        points: [number, number, number];
        /**
         * 包含的三个边索引
         */
        lines: [number, number, number] = <any>[];

        //
        pointmap: Map<number, Point>;
        linemap: Map<number, Line>;
        trianglemap: Map<number, Triangle>;

        constructor(pointmap, linemap, trianglemap)
        {
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }

        getTriangle3D()
        {
            var points: feng3d.Vector3[] = [];
            this.points.forEach(element =>
            {
                var pointvalue = this.pointmap.get(element).value;
                points.push(new feng3d.Vector3(pointvalue[0], pointvalue[1], pointvalue[2]));
            });
            var triangle3D = new feng3d.Triangle3D(points[0], points[1], points[2]);
            return triangle3D;
        }

        /**
         * 获取法线
         */
        getNormal()
        {
            var normal = this.getTriangle3D().getNormal();
            return normal;
        }
    }

    /**
     * 边
     */
    class Line0
    {
        /**
         * 线段索引
         */
        index: number;
        /**
         * 边所在直线
         */
        segment: feng3d.Segment3D;
        /**
         * 可行走区域的内部方向
         */
        direction: feng3d.Vector3;
        /**
         * 左方边索引
         */
        leftline: number;
        /**
         * 左方边索引
         */
        rightline: number;
    }

    class NavigationData
    {
        pointmap: Map<number, Point>;
        linemap: Map<number, Line>;
        trianglemap: Map<number, Triangle>;

        init(geometry: { positions: number[], indices: number[] })
        {
            var positions = geometry.positions;
            var indices = geometry.indices;

            feng3d.debuger && feng3d.assert(indices.length % 3 == 0);
            var pointmap = this.pointmap = new Map<number, Point>();
            var linemap = this.linemap = new Map<number, Line>();
            var trianglemap = this.trianglemap = new Map<number, Triangle>();
            // 合并相同点
            var pointAutoIndex = 0;
            var pointcache: { [x: number]: { [y: number]: { [z: number]: Point } } } = {};
            var pointindexmap: { [oldindex: number]: number } = {};//通过点原来索引映射到新索引
            //
            var lineAutoIndex = 0;
            var linecache: { [point0: number]: { [point1: number]: Line } } = {};
            //
            for (let i = 0, n = positions.length; i < n; i += 3)
            {
                var point = createPoint(positions[i], positions[i + 1], positions[i + 2]);
                pointindexmap[i / 3] = point.index;
            }
            indices = indices.map((pointindex) => { return pointindexmap[pointindex]; })
            //
            for (let i = 0, n = indices.length; i < n; i += 3)
            {
                var triangle = new Triangle(pointmap, linemap, trianglemap);
                triangle.index = i / 3;
                triangle.points = [indices[i], indices[i + 1], indices[i + 2]];
                trianglemap.set(triangle.index, triangle);
                //
                pointmap.get(indices[i]).triangles.push(triangle.index);
                pointmap.get(indices[i + 1]).triangles.push(triangle.index);
                pointmap.get(indices[i + 2]).triangles.push(triangle.index);
                //
                var points = triangle.points.concat().sort().map((value) => { return pointmap.get(value); });
                createLine(points[0], points[1], triangle);
                createLine(points[0], points[2], triangle);
                createLine(points[1], points[2], triangle);
            }

            function createLine(point0: Point, point1: Point, triangle: Triangle)
            {
                linecache[point0.index] = linecache[point0.index] || {};
                var line = linecache[point0.index][point1.index];
                if (!line)
                {
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

            function createPoint(x: number, y: number, z: number)
            {
                var xs = x.toPrecision(6);
                var ys = y.toPrecision(6);
                var zs = z.toPrecision(6);

                pointcache[xs] = pointcache[xs] || {};
                pointcache[xs][ys] = pointcache[xs][ys] || {};
                var point = pointcache[xs][ys][zs];
                if (!point)
                {
                    point = pointcache[xs][ys][zs] = new Point(pointmap, linemap, trianglemap);
                    point.index = pointAutoIndex++;
                    point.value = [x, y, z];
                    pointmap.set(point.index, point);
                }
                return point;
            }
        }

        getGeometry()
        {
            var positions: number[] = [];
            var pointIndexMap = new Map<number, number>();
            var autoId = 0;
            var indices: number[] = [];
            this.trianglemap.forEach(element =>
            {
                var points = element.points.map((pointIndex) =>
                {
                    if (pointIndexMap.has(pointIndex))
                    {
                        return pointIndexMap.get(pointIndex);
                    }
                    positions.push.apply(positions, this.pointmap.get(pointIndex).value);
                    pointIndexMap.set(pointIndex, autoId++);
                    return autoId - 1;
                })
                indices.push.apply(indices, points);
            });
            return { positions: positions, indices: indices };
        }

        resetData()
        {
            var geometry = this.getGeometry();
            this.clearData();
            this.init(geometry);
        }

        clearData()
        {
            this.pointmap.forEach(point =>
            {
                point.pointmap = point.linemap = point.trianglemap = null;
            });
            this.pointmap.clear();
            this.linemap.forEach(line =>
            {

            });
            this.linemap.clear();
            this.trianglemap.forEach(triangle =>
            {

            });
            this.trianglemap.clear();
        }
    }
}

var segmentGeometry: feng3d.SegmentGeometry;
var debugSegment: feng3d.GameObject;
//
var pointGeometry: feng3d.PointGeometry;
var debugPoint: feng3d.GameObject;

function createSegment()
{
    throw `未实现`;
    // var parentobject = editor.engine.root.find("editorObject") || editor.engine.root;
    var parentobject;
    if (!debugSegment)
    {
        debugSegment = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "segment" });
        debugSegment.mouseEnabled = false;
        //初始化材质
        var model = debugSegment.addComponent(feng3d.Model);
        var material = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1.0, 0, 0) },
        });
        segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
    }
    parentobject.addChild(debugSegment);
    //
    if (!debugPoint)
    {
        debugPoint = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "points" });
        debugPoint.mouseEnabled = false;
        var model = debugPoint.addComponent(feng3d.Model);
        pointGeometry = model.geometry = new feng3d.PointGeometry();
        var materialp = model.material = feng3d.serialization.setValue(new feng3d.Material(), {
            shaderName: "point", renderParams: { renderMode: feng3d.RenderMode.POINTS },
            uniforms: { u_PointSize: 5, u_color: new feng3d.Color4() },
        });
    }
    pointGeometry.points = [];
    parentobject.addChild(debugPoint);
}