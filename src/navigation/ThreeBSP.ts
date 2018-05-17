// see https://github.com/sshirokov/ThreeBSP

namespace feng3d
{
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

    export class ThreeBSP
    {
        tree: ThreeBSPNode;

        constructor(geometry?: { positions: number[], uvs: number[], normals: number[], indices: number[] } | ThreeBSPNode)
        {
            if (geometry instanceof ThreeBSPNode)
            {
                this.tree = geometry;
            } else
            {
                this.tree = new ThreeBSPNode(geometry);
            }
        }

        toGeometry()
        {
            var data = this.tree.getGeometryData();
            return data;
        }

        /**
         * 相减
         * @param other 
         */
        subtract(other: ThreeBSP)
        {
            var them = other.tree.clone(), us = this.tree.clone();
            us.invert().clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };

        /**
         * 相加
         * @param other 
         */
        union(other: ThreeBSP)
        {
            var them = other.tree.clone(), us = this.tree.clone();
            us.clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()));
        };

        /**
         * 相交
         * @param other 
         */
        intersect(other: ThreeBSP)
        {
            var them = other.tree.clone(), us = this.tree.clone();
            them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };
    }

    /**
     * 顶点
     */
    export class ThreeBSPVertex
    {
        /**
         * 坐标
         */
        position: Vector3;
        /**
         * uv
         */
        uv: Vector2;
        /**
         * 法线
         */
        normal: Vector3;

        constructor(position: Vector3, normal: Vector3, uv: Vector2)
        {
            this.position = position;
            this.normal = normal || new Vector3();
            this.uv = uv || new Vector2();
        }

        /**
         * 克隆
         */
        clone()
        {
            return new ThreeBSPVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
        };

        /**
         * 
         * @param v 线性插值
         * @param alpha 
         */
        lerp(v: ThreeBSPVertex, alpha: number)
        {
            this.position.lerpNumber(v.position, alpha);
            this.uv.lerpNumber(v.uv, alpha);
            this.normal.lerpNumber(v.position, alpha);
            return this;
        };

        interpolate(v: ThreeBSPVertex, alpha: number)
        {
            return this.clone().lerp(v, alpha);
        };
    }

    /**
     * 多边形
     */
    export class ThreeBSPPolygon
    {
        /**
         * 多边形所在面w值
         */
        w: number;
        /**
         * 法线
         */
        normal: Vector3;
        /**
         * 顶点列表
         */
        vertices: ThreeBSPVertex[];
        constructor(vertices?: ThreeBSPVertex[])
        {
            this.vertices = vertices || [];
            if (this.vertices.length)
            {
                this.calculateProperties();
            }
        }

        /**
         * 获取多边形几何体数据
         * @param data 
         */
        getGeometryData(data?: { positions: number[], uvs: number[], normals: number[] })
        {
            data = data || { positions: [], uvs: [], normals: [] };
            var vertices = data.positions = data.positions || [];
            var uvs = data.uvs = data.uvs || [];
            var normals = data.normals = data.normals || [];

            for (var i = 2, n = this.vertices.length; i < n; i++)
            {
                var v0 = this.vertices[0], v1 = this.vertices[i - 1], v2 = this.vertices[i];
                vertices.push(v0.position.x, v0.position.y, v0.position.z,
                    v1.position.x, v1.position.y, v1.position.z,
                    v2.position.x, v2.position.y, v2.position.z);
                uvs.push(v0.uv.x, v0.uv.y,
                    v1.uv.x, v1.uv.y,
                    v2.uv.x, v2.uv.y);
                normals.push(this.normal.x, this.normal.y, this.normal.z,
                    this.normal.x, this.normal.y, this.normal.z,
                    this.normal.x, this.normal.y, this.normal.z);
            }
            return data;
        }

        /**
         * 计算法线与w值
         */
        calculateProperties()
        {
            var a = this.vertices[0].position, b = this.vertices[1].position, c = this.vertices[2].position;
            this.normal = b.clone().subTo(a).crossTo(c.clone().subTo(a)).normalize();
            this.w = this.normal.clone().dot(a);

            return this;
        };

        /**
         * 克隆
         */
        clone()
        {
            var vertices = this.vertices.map((v) => { return v.clone(); });
            return new ThreeBSPPolygon(vertices);
        };

        /**
         * 翻转多边形
         */
        invert()
        {
            this.normal.scale(-1);
            this.w *= -1;
            this.vertices.reverse();
            return this;
        };

        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex 
         */
        classifyVertex(vertex: ThreeBSPVertex)
        {
            var side = this.normal.dot(vertex.position) - this.w;
            if (side < -EPSILON)
                return BACK;
            if (side > EPSILON)
                return FRONT;
            return COPLANAR;
        }

        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon 
         */
        classifySide(polygon: ThreeBSPPolygon)
        {
            var front = 0, back = 0;
            polygon.vertices.forEach(v =>
            {
                var side = this.classifyVertex(v);
                if (side == FRONT)
                    front += 1;
                else if (side == BACK)
                    back += 1;
            });

            if (front > 0 && back === 0)
            {
                return FRONT;
            }
            if (front === 0 && back > 0)
            {
                return BACK;
            }
            if (front === back && back === 0)
            {
                return COPLANAR;
            }
            return SPANNING;
        }

        /**
         * 切割多边形
         * @param poly 
         */
        tessellate(poly: ThreeBSPPolygon)
        {
            if (this.classifySide(poly) !== SPANNING)
            {
                return [poly];
            }

            var f: ThreeBSPVertex[] = [];
            var b: ThreeBSPVertex[] = [];
            var count = poly.vertices.length;

            //切割多边形的每条边
            poly.vertices.forEach((item, i) =>
            {
                var vi = poly.vertices[i];
                var vj = poly.vertices[(i + 1) % count];
                var ti = this.classifyVertex(vi);
                var tj = this.classifyVertex(vj);

                if (ti !== BACK)
                {
                    f.push(vi);
                }
                if (ti !== FRONT)
                {
                    b.push(vi);
                }
                // 切割横跨多边形的边
                if ((ti | tj) === SPANNING)
                {
                    var t = (this.w - this.normal.dot(vi.position)) / this.normal.dot(vj.clone().position.subTo(vi.position));
                    var v = vi.interpolate(vj, t);
                    f.push(v);
                    b.push(v);
                }
            });

            // 处理切割后的多边形
            var polys: ThreeBSPPolygon[] = []
            if (f.length >= 3)
            {
                polys.push(new ThreeBSPPolygon(f));
            }
            if (b.length >= 3)
            {
                polys.push(new ThreeBSPPolygon(b));
            }
            return polys;
        }

        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形 
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        subdivide(polygon: ThreeBSPPolygon, coplanar_front: ThreeBSPPolygon[], coplanar_back: ThreeBSPPolygon[], front: ThreeBSPPolygon[], back: ThreeBSPPolygon[])
        {
            this.tessellate(polygon).forEach(poly =>
            {
                var side = this.classifySide(poly);
                switch (side)
                {
                    case FRONT:
                        front.push(poly);
                        break;
                    case BACK:
                        back.push(poly);
                        break;
                    case COPLANAR:
                        if (this.normal.dot(poly.normal) > 0)
                        {
                            coplanar_front.push(poly);
                        } else
                        {
                            coplanar_back.push(poly);
                        }
                        break;
                    default:
                        throw new Error("BUG: Polygon of classification " + side + " in subdivision");
                }
            });
        };
    }

    /**
     * 节点
     */
    export class ThreeBSPNode
    {
        /**
         * 多边形列表
         */
        polygons: ThreeBSPPolygon[];
        /**
         * 切割面
         */
        divider: ThreeBSPPolygon;
        front: ThreeBSPNode;
        back: ThreeBSPNode;

        constructor(data?: { positions: number[], uvs: number[], normals: number[], indices: number[] })
        {
            this.polygons = [];
            if (!data)
                return;

            var positions: number[] = data.positions;
            var normals: number[] = data.normals;
            var uvs: number[] = data.uvs;
            var indices: number[] = data.indices;

            // 初始化多边形
            var polygons: ThreeBSPPolygon[] = [];
            for (let i = 0, n = indices.length; i < n; i += 3)
            {
                var polygon = new ThreeBSPPolygon();

                var i0 = indices[i]
                var i1 = indices[i + 1];
                var i2 = indices[i + 2];

                polygon.vertices = [
                    new ThreeBSPVertex(new Vector3(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]), new Vector3(normals[i0 * 3], normals[i0 * 3 + 1], normals[i0 * 3 + 2]), new Vector2(uvs[i0 * 2], uvs[i0 * 2 + 1])),
                    new ThreeBSPVertex(new Vector3(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]), new Vector3(normals[i1 * 3], normals[i1 * 3 + 1], normals[i1 * 3 + 2]), new Vector2(uvs[i1 * 2], uvs[i1 * 2 + 1])),
                    new ThreeBSPVertex(new Vector3(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]), new Vector3(normals[i2 * 3], normals[i2 * 3 + 1], normals[i2 * 3 + 2]), new Vector2(uvs[i2 * 2], uvs[i2 * 2 + 1])),
                ];
                polygon.calculateProperties()
                polygons.push(polygon);
            }
            if (polygons.length)
            {
                this.build(polygons);
            }
        }

        /**
         * 获取几何体数据
         */
        getGeometryData()
        {
            var data: { positions: number[], uvs: number[], normals: number[], indices: number[] } = { positions: [], uvs: [], normals: [], indices: [] };
            var polygons = this.allPolygons();
            polygons.forEach(polygon =>
            {
                polygon.getGeometryData(data);
            });
            for (let i = 0, indices = data.indices, n = data.positions.length / 3; i < n; i++)
            {
                indices.push(i);
            }
            return data;
        }

        /**
         * 克隆
         */
        clone()
        {
            var node = new ThreeBSPNode();
            node.divider = this.divider && this.divider.clone();
            node.polygons = this.polygons.map(element =>
            {
                return element.clone();
            });
            node.front = this.front && this.front.clone();
            node.back = this.back && this.back.clone();
            return node;
        };

        /**
         * 构建树节点
         * @param polygons 多边形列表
         */
        build(polygons: ThreeBSPPolygon[])
        {
            // 以第一个多边形为切割面
            if (this.divider == null)
            {
                this.divider = polygons[0].clone();
            }

            var front: ThreeBSPPolygon[] = [], back: ThreeBSPPolygon[] = [];
            //进行切割并分类
            polygons.forEach(poly =>
            {
                this.divider.subdivide(poly, this.polygons, this.polygons, front, back);
            });

            // 继续切割平面前的多边形
            if (front.length > 0)
            {
                this.front = this.front || new ThreeBSPNode();
                this.front.build(front);
            }

            // 继续切割平面后的多边形
            if (back.length > 0)
            {
                this.back = this.back || new ThreeBSPNode();
                this.back.build(back);
            }
            return this;
        };

        /**
         * 判定是否为凸面体
         * @param polys 
         */
        isConvex(polys: ThreeBSPPolygon[])
        {
            polys.every(inner =>
            {
                return polys.every(outer =>
                {
                    if (inner !== outer && outer.classifySide(inner) !== BACK)
                    {
                        return false;
                    }
                    return true;
                });
            });
            return true;
        };

        /**
         * 所有多边形
         */
        allPolygons()
        {
            var front = (this.front && this.front.allPolygons()) || [];
            var back = (this.back && this.back.allPolygons()) || [];
            var polygons: ThreeBSPPolygon[] = this.polygons.slice().concat(front).concat(back);
            return polygons;
        };

        /**
         * 翻转
         */
        invert()
        {
            this.polygons.forEach(poly =>
            {
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

        /**
         * 裁剪多边形
         * @param polygons 
         */
        clipPolygons(polygons: ThreeBSPPolygon[])
        {
            if (!this.divider)
            {
                return polygons.slice();
            }
            var front: ThreeBSPPolygon[] = [];
            var back: ThreeBSPPolygon[] = [];

            polygons.forEach(polygon =>
            {
                this.divider.subdivide(polygon, front, back, front, back);
            });

            if (this.front)
            {
                front = this.front.clipPolygons(front);
            }
            if (this.back)
            {
                back = this.back.clipPolygons(back);
            }
            if (this.back)
            {
                return front.concat(back);
            }
            return front;
        };

        clipTo(node: ThreeBSPNode)
        {
            this.polygons = node.clipPolygons(this.polygons);
            this.front && this.front.clipTo(node);
            this.back && this.back.clipTo(node);
            return this;
        };
    }
}