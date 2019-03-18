// see https://github.com/sshirokov/ThreeBSP
var feng3d;
(function (feng3d) {
    /**
     * 精度值
     */
    var EPSILON = 1e-5;
    /**
     * 共面
     */
    var COPLANAR = 0;
    /**
     * 正面
     */
    var FRONT = 1;
    /**
     * 反面
     */
    var BACK = 2;
    /**
     * 横跨
     */
    var SPANNING = 3;
    var ThreeBSP = /** @class */ (function () {
        function ThreeBSP(geometry) {
            if (geometry instanceof ThreeBSPNode) {
                this.tree = geometry;
            }
            else {
                this.tree = new ThreeBSPNode(geometry);
            }
        }
        ThreeBSP.prototype.toGeometry = function () {
            var data = this.tree.getGeometryData();
            return data;
        };
        /**
         * 相减
         * @param other
         */
        ThreeBSP.prototype.subtract = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.invert().clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };
        ;
        /**
         * 相加
         * @param other
         */
        ThreeBSP.prototype.union = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()));
        };
        ;
        /**
         * 相交
         * @param other
         */
        ThreeBSP.prototype.intersect = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };
        ;
        return ThreeBSP;
    }());
    feng3d.ThreeBSP = ThreeBSP;
    /**
     * 顶点
     */
    var ThreeBSPVertex = /** @class */ (function () {
        function ThreeBSPVertex(position, normal, uv) {
            this.position = position;
            this.normal = normal || new feng3d.Vector3();
            this.uv = uv || new feng3d.Vector2();
        }
        /**
         * 克隆
         */
        ThreeBSPVertex.prototype.clone = function () {
            return new ThreeBSPVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
        };
        ;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        ThreeBSPVertex.prototype.lerp = function (v, alpha) {
            this.position.lerpNumber(v.position, alpha);
            this.uv.lerpNumber(v.uv, alpha);
            this.normal.lerpNumber(v.position, alpha);
            return this;
        };
        ;
        ThreeBSPVertex.prototype.interpolate = function (v, alpha) {
            return this.clone().lerp(v, alpha);
        };
        ;
        return ThreeBSPVertex;
    }());
    feng3d.ThreeBSPVertex = ThreeBSPVertex;
    /**
     * 多边形
     */
    var ThreeBSPPolygon = /** @class */ (function () {
        function ThreeBSPPolygon(vertices) {
            this.vertices = vertices || [];
            if (this.vertices.length) {
                this.calculateProperties();
            }
        }
        /**
         * 获取多边形几何体数据
         * @param data
         */
        ThreeBSPPolygon.prototype.getGeometryData = function (data) {
            data = data || { positions: [], uvs: [], normals: [] };
            var vertices = data.positions = data.positions || [];
            var uvs = data.uvs = data.uvs || [];
            var normals = data.normals = data.normals || [];
            for (var i = 2, n = this.vertices.length; i < n; i++) {
                var v0 = this.vertices[0], v1 = this.vertices[i - 1], v2 = this.vertices[i];
                vertices.push(v0.position.x, v0.position.y, v0.position.z, v1.position.x, v1.position.y, v1.position.z, v2.position.x, v2.position.y, v2.position.z);
                uvs.push(v0.uv.x, v0.uv.y, v1.uv.x, v1.uv.y, v2.uv.x, v2.uv.y);
                normals.push(this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z);
            }
            return data;
        };
        /**
         * 计算法线与w值
         */
        ThreeBSPPolygon.prototype.calculateProperties = function () {
            var a = this.vertices[0].position, b = this.vertices[1].position, c = this.vertices[2].position;
            this.normal = b.clone().subTo(a).crossTo(c.clone().subTo(a)).normalize();
            this.w = this.normal.clone().dot(a);
            return this;
        };
        ;
        /**
         * 克隆
         */
        ThreeBSPPolygon.prototype.clone = function () {
            var vertices = this.vertices.map(function (v) { return v.clone(); });
            return new ThreeBSPPolygon(vertices);
        };
        ;
        /**
         * 翻转多边形
         */
        ThreeBSPPolygon.prototype.invert = function () {
            this.normal.scaleNumber(-1);
            this.w *= -1;
            this.vertices.reverse();
            return this;
        };
        ;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        ThreeBSPPolygon.prototype.classifyVertex = function (vertex) {
            var side = this.normal.dot(vertex.position) - this.w;
            if (side < -EPSILON)
                return BACK;
            if (side > EPSILON)
                return FRONT;
            return COPLANAR;
        };
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        ThreeBSPPolygon.prototype.classifySide = function (polygon) {
            var _this = this;
            var front = 0, back = 0;
            polygon.vertices.forEach(function (v) {
                var side = _this.classifyVertex(v);
                if (side == FRONT)
                    front += 1;
                else if (side == BACK)
                    back += 1;
            });
            if (front > 0 && back === 0) {
                return FRONT;
            }
            if (front === 0 && back > 0) {
                return BACK;
            }
            if (front === back && back === 0) {
                return COPLANAR;
            }
            return SPANNING;
        };
        /**
         * 切割多边形
         * @param poly
         */
        ThreeBSPPolygon.prototype.tessellate = function (poly) {
            var _this = this;
            if (this.classifySide(poly) !== SPANNING) {
                return [poly];
            }
            var f = [];
            var b = [];
            var count = poly.vertices.length;
            //切割多边形的每条边
            poly.vertices.forEach(function (item, i) {
                var vi = poly.vertices[i];
                var vj = poly.vertices[(i + 1) % count];
                var ti = _this.classifyVertex(vi);
                var tj = _this.classifyVertex(vj);
                if (ti !== BACK) {
                    f.push(vi);
                }
                if (ti !== FRONT) {
                    b.push(vi);
                }
                // 切割横跨多边形的边
                if ((ti | tj) === SPANNING) {
                    var t = (_this.w - _this.normal.dot(vi.position)) / _this.normal.dot(vj.clone().position.subTo(vi.position));
                    var v = vi.interpolate(vj, t);
                    f.push(v);
                    b.push(v);
                }
            });
            // 处理切割后的多边形
            var polys = [];
            if (f.length >= 3) {
                polys.push(new ThreeBSPPolygon(f));
            }
            if (b.length >= 3) {
                polys.push(new ThreeBSPPolygon(b));
            }
            return polys;
        };
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        ThreeBSPPolygon.prototype.subdivide = function (polygon, coplanar_front, coplanar_back, front, back) {
            var _this = this;
            this.tessellate(polygon).forEach(function (poly) {
                var side = _this.classifySide(poly);
                switch (side) {
                    case FRONT:
                        front.push(poly);
                        break;
                    case BACK:
                        back.push(poly);
                        break;
                    case COPLANAR:
                        if (_this.normal.dot(poly.normal) > 0) {
                            coplanar_front.push(poly);
                        }
                        else {
                            coplanar_back.push(poly);
                        }
                        break;
                    default:
                        throw new Error("BUG: Polygon of classification " + side + " in subdivision");
                }
            });
        };
        ;
        return ThreeBSPPolygon;
    }());
    feng3d.ThreeBSPPolygon = ThreeBSPPolygon;
    /**
     * 结点
     */
    var ThreeBSPNode = /** @class */ (function () {
        function ThreeBSPNode(data) {
            this.polygons = [];
            if (!data)
                return;
            var positions = data.positions;
            var normals = data.normals;
            var uvs = data.uvs;
            var indices = data.indices;
            // 初始化多边形
            var polygons = [];
            for (var i = 0, n = indices.length; i < n; i += 3) {
                var polygon = new ThreeBSPPolygon();
                var i0 = indices[i];
                var i1 = indices[i + 1];
                var i2 = indices[i + 2];
                polygon.vertices = [
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]), new feng3d.Vector3(normals[i0 * 3], normals[i0 * 3 + 1], normals[i0 * 3 + 2]), new feng3d.Vector2(uvs[i0 * 2], uvs[i0 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]), new feng3d.Vector3(normals[i1 * 3], normals[i1 * 3 + 1], normals[i1 * 3 + 2]), new feng3d.Vector2(uvs[i1 * 2], uvs[i1 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]), new feng3d.Vector3(normals[i2 * 3], normals[i2 * 3 + 1], normals[i2 * 3 + 2]), new feng3d.Vector2(uvs[i2 * 2], uvs[i2 * 2 + 1])),
                ];
                polygon.calculateProperties();
                polygons.push(polygon);
            }
            if (polygons.length) {
                this.build(polygons);
            }
        }
        /**
         * 获取几何体数据
         */
        ThreeBSPNode.prototype.getGeometryData = function () {
            var data = { positions: [], uvs: [], normals: [], indices: [] };
            var polygons = this.allPolygons();
            polygons.forEach(function (polygon) {
                polygon.getGeometryData(data);
            });
            for (var i = 0, indices = data.indices, n = data.positions.length / 3; i < n; i++) {
                indices.push(i);
            }
            return data;
        };
        /**
         * 克隆
         */
        ThreeBSPNode.prototype.clone = function () {
            var node = new ThreeBSPNode();
            node.divider = this.divider && this.divider.clone();
            node.polygons = this.polygons.map(function (element) {
                return element.clone();
            });
            node.front = this.front && this.front.clone();
            node.back = this.back && this.back.clone();
            return node;
        };
        ;
        /**
         * 构建树结点
         * @param polygons 多边形列表
         */
        ThreeBSPNode.prototype.build = function (polygons) {
            var _this = this;
            // 以第一个多边形为切割面
            if (this.divider == null) {
                this.divider = polygons[0].clone();
            }
            var front = [], back = [];
            //进行切割并分类
            polygons.forEach(function (poly) {
                _this.divider.subdivide(poly, _this.polygons, _this.polygons, front, back);
            });
            // 继续切割平面前的多边形
            if (front.length > 0) {
                this.front = this.front || new ThreeBSPNode();
                this.front.build(front);
            }
            // 继续切割平面后的多边形
            if (back.length > 0) {
                this.back = this.back || new ThreeBSPNode();
                this.back.build(back);
            }
            return this;
        };
        ;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        ThreeBSPNode.prototype.isConvex = function (polys) {
            polys.every(function (inner) {
                return polys.every(function (outer) {
                    if (inner !== outer && outer.classifySide(inner) !== BACK) {
                        return false;
                    }
                    return true;
                });
            });
            return true;
        };
        ;
        /**
         * 所有多边形
         */
        ThreeBSPNode.prototype.allPolygons = function () {
            var front = (this.front && this.front.allPolygons()) || [];
            var back = (this.back && this.back.allPolygons()) || [];
            var polygons = this.polygons.slice().concat(front).concat(back);
            return polygons;
        };
        ;
        /**
         * 翻转
         */
        ThreeBSPNode.prototype.invert = function () {
            this.polygons.forEach(function (poly) {
                poly.invert();
            });
            this.divider && this.divider.invert();
            this.front && this.front.invert();
            this.back && this.back.invert();
            var temp = this.back;
            this.back = this.front;
            this.front = temp;
            return this;
        };
        ;
        /**
         * 裁剪多边形
         * @param polygons
         */
        ThreeBSPNode.prototype.clipPolygons = function (polygons) {
            var _this = this;
            if (!this.divider) {
                return polygons.slice();
            }
            var front = [];
            var back = [];
            polygons.forEach(function (polygon) {
                _this.divider.subdivide(polygon, front, back, front, back);
            });
            if (this.front) {
                front = this.front.clipPolygons(front);
            }
            if (this.back) {
                back = this.back.clipPolygons(back);
            }
            if (this.back) {
                return front.concat(back);
            }
            return front;
        };
        ;
        ThreeBSPNode.prototype.clipTo = function (node) {
            this.polygons = node.clipPolygons(this.polygons);
            this.front && this.front.clipTo(node);
            this.back && this.back.clipTo(node);
            return this;
        };
        ;
        return ThreeBSPNode;
    }());
    feng3d.ThreeBSPNode = ThreeBSPNode;
})(feng3d || (feng3d = {}));
//# sourceMappingURL=ThreeBSP.js.map