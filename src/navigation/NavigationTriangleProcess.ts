namespace navigation
{
    export class NavigationTriangleProcess
    {
        geometry: { positions: number[], indices: number[] }

        pointmap: Map<number, Point>;
        linemap: Map<number, Line>;
        trianglemap: Map<number, Triangle>;

        constructor(geometry: { positions: number[], indices: number[] })
        {
            this.geometry = geometry;

            this.initTriangles(geometry.positions, geometry.indices);
        }

        private initTriangles(positions: number[], indices: number[])
        {
            feng3d.assert(indices.length % 3 == 0);
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
                var triangle = new Triangle();
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
                    point = pointcache[xs][ys][zs] = new Point();
                    point.index = pointAutoIndex++;
                    point.value = [x, y, z];
                    pointmap.set(point.index, point);
                }
                return point;
            }
        }

        checkMaxSlope(maxSlope: number)
        {
            var up = new feng3d.Vector3D(0, 1, 0);
            var mincos = Math.cos(maxSlope * Math.DEG2RAD);

            var keys = this.trianglemap.getKeys();
            keys.forEach(element =>
            {
                var normal = this.getTriangleNormal(element);
                var dot = normal.dotProduct(up);
                if (dot < mincos)
                {
                    this.trianglemap.delete(element);
                }
            });
        }

        checkAgentRadius(agentRadius: number)
        {
            //获取所有独立边
            var lines = this.getAllSingleLine();
            //调试独立边
            this.debugShowLines(lines);

            var trianglemap = this.trianglemap;
            var pointmap = this.pointmap;

            // 计算边所在直线以及可行走区域的内部方向
            var line0s = lines.map((line =>
            {
                var line0 = new Line0();
                line0.index = line.index;
                var points = line.points.map((v) => { var point = pointmap.get(v); return new feng3d.Vector3D(point.value[0], point.value[1], point.value[2]); })
                line0.line = new feng3d.Line3D(points[0], points[1].subtract(points[0]));
                //
                var triangle = trianglemap.get(line.triangles[0]);
                if (!triangle)
                    return;
                var linepoints = line.points.map((v) => { return pointmap.get(v); })
                var otherPoint = pointmap.get(triangle.points.filter((v) =>
                {
                    return line.points.indexOf(v) == -1;
                })[0]).getPoint();
                line0.direction = line0.line.direction.crossProduct(otherPoint.subtract(line0.line.position)).crossProduct(line0.line.direction).normalize();
                return line0;
            }));

            pointmap.getValues().forEach(point =>
            {
                var p = point.getPoint();
                var crossline0s: [Line0, number][] = line0s.reduce((result, line0) =>
                {
                    var distance = line0.line.getPointDistance(p);
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
                    point.setPoint(point.getPoint().add(crossline0s[0][0].direction.clone().scaleBy(agentRadius - crossline0s[0][1])));
                }
            });

            // lines.forEach(element =>
            // {
            //     singleLineAgentRadius(element);
            // });

            // function singleLineAgentRadius(line: Line)
            // {
            //     var triangle = trianglemap.get(line.triangles[0]);
            //     if (!triangle)
            //         return;
            //     var linepoints = line.points.map((v) => { return pointmap.get(v); })

            //     var otherPoint = pointmap.get(triangle.points.filter((v) =>
            //     {
            //         return line.points.indexOf(v) == -1;
            //     })[0]);

            //     var distance = pointToLineDistance(otherPoint, linepoints[0], linepoints[1]);
            //     if (distance < agentRadius)
            //     {
            //         trianglemap.delete(triangle.index);
            //     }
            // }

            // function pointToLineDistance(point: Point, linePoint0: Point, linePoint1: Point)
            // {
            //     var p = new feng3d.Vector3D(point.value[0], point.value[1], point.value[2])
            //     var lp0 = new feng3d.Vector3D(linePoint0.value[0], linePoint0.value[1], linePoint0.value[2])
            //     var lp1 = new feng3d.Vector3D(linePoint1.value[0], linePoint1.value[1], linePoint1.value[2])

            //     var cos = p.subtract(lp0).normalize().dotProduct(lp1.subtract(lp0).normalize());
            //     var sin = Math.sqrt(1 - cos * cos);
            //     var distance = sin * p.subtract(lp0).length;
            //     distance = Number(distance.toPrecision(6));
            //     return distance;
            // }
        }

        getGeometry()
        {
            var positions: number[] = [];
            var pointIndexMap = new Map<number, number>();
            var autoId = 0;
            this.pointmap.forEach(point =>
            {
                pointIndexMap.set(point.index, autoId++);
                positions.push.apply(positions, point.value);
            });

            var indices: number[] = [];
            this.trianglemap.forEach(element =>
            {
                var points = element.points.map((value) => { return pointIndexMap.get(value); })
                indices.push.apply(indices, points);
            });
            this.geometry.positions = positions;
            this.geometry.indices = indices;
            return this.geometry;
        }

        private debugShowLines(lines: Line[])
        {
            if (!debugSegment)
            {
                createSegment();
            }
            segmentGeometry.removeAllSegments();
            lines.forEach(element =>
            {
                var points = element.points.map((pointindex) =>
                {
                    var value = this.pointmap.get(pointindex).value;
                    return new feng3d.Vector3D(value[0], value[1], value[2]);
                });
                segmentGeometry.addSegment(new feng3d.Segment(points[0], points[1]));
            });
            var parentobject = feng3d.editor.engine.root.find("editorObject") || feng3d.editor.engine.root;
            parentobject.addChild(debugSegment);
        }

        /**
         * 获取三角形法线
         * @param triangleIndex 三角形索引
         */
        private getTriangleNormal(triangleIndex: number)
        {
            var triangle = this.trianglemap.get(triangleIndex);
            var points: feng3d.Vector3D[] = [];
            triangle.points.forEach(element =>
            {
                var pointvalue = this.pointmap.get(element).value;
                points.push(new feng3d.Vector3D(pointvalue[0], pointvalue[1], pointvalue[2]));
            });
            var line0 = points[0].subtract(points[1]);
            var line1 = points[1].subtract(points[2]);
            var normal = line0.crossProduct(line1);
            normal.normalize();
            return normal;
        }

        /**
         * 获取所有独立边
         */
        private getAllSingleLine()
        {
            var lines: Line[] = [];
            var needLine: Line[] = [];
            this.linemap.forEach(element =>
            {
                element.triangles = element.triangles.filter((triangleIndex) => { return this.trianglemap.has(triangleIndex); });
                if (element.triangles.length == 1)
                    lines.push(element);
                else if (element.triangles.length == 0)
                    needLine.push(element);
            });
            needLine.forEach(element =>
            {
                this.linemap.delete(element.index);
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

        setPoint(p: feng3d.Vector3D)
        {
            this.value = [p.x, p.y, p.z];
        }

        getPoint()
        {
            return new feng3d.Vector3D(this.value[0], this.value[1], this.value[2]);
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
        line: feng3d.Line3D;
        /**
         * 可行走区域的内部方向
         */
        direction: feng3d.Vector3D;
    }
}

var segmentGeometry: feng3d.SegmentGeometry;
var debugSegment: feng3d.GameObject;

function createSegment()
{
    debugSegment = feng3d.GameObject.create("segment");
    debugSegment.mouseEnabled = false;
    //初始化材质
    var meshRenderer = debugSegment.addComponent(feng3d.MeshRenderer);
    var material = meshRenderer.material = new feng3d.SegmentMaterial();
    material.color.setTo(1.0, 0, 0);
    segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
}

// function pointToLineDistance(p: feng3d.Vector3D, lp0: feng3d.Vector3D, lp1: feng3d.Vector3D)
// {
//     var cos = p.subtract(lp0).normalize().dotProduct(lp1.subtract(lp0).normalize());
//     var sin = Math.sqrt(1 - cos * cos);
//     var distance = sin * p.subtract(lp0).length;
//     distance = Number(distance.toPrecision(6));
//     return distance;
// }