declare namespace feng3d {
    class ThreeBSP {
        tree: ThreeBSPNode;
        constructor(geometry?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        } | ThreeBSPNode);
        toGeometry(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 相减
         * @param other
         */
        subtract(other: ThreeBSP): ThreeBSP;
        /**
         * 相加
         * @param other
         */
        union(other: ThreeBSP): ThreeBSP;
        /**
         * 相交
         * @param other
         */
        intersect(other: ThreeBSP): ThreeBSP;
    }
    /**
     * 顶点
     */
    class ThreeBSPVertex {
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
        constructor(position: Vector3, normal: Vector3, uv: Vector2);
        /**
         * 克隆
         */
        clone(): ThreeBSPVertex;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        lerp(v: ThreeBSPVertex, alpha: number): this;
        interpolate(v: ThreeBSPVertex, alpha: number): ThreeBSPVertex;
    }
    /**
     * 多边形
     */
    class ThreeBSPPolygon {
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
        constructor(vertices?: ThreeBSPVertex[]);
        /**
         * 获取多边形几何体数据
         * @param data
         */
        getGeometryData(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
        }): {
            positions: number[];
            uvs: number[];
            normals: number[];
        };
        /**
         * 计算法线与w值
         */
        calculateProperties(): this;
        /**
         * 克隆
         */
        clone(): ThreeBSPPolygon;
        /**
         * 翻转多边形
         */
        invert(): this;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        classifyVertex(vertex: ThreeBSPVertex): number;
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        classifySide(polygon: ThreeBSPPolygon): number;
        /**
         * 切割多边形
         * @param poly
         */
        tessellate(poly: ThreeBSPPolygon): ThreeBSPPolygon[];
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        subdivide(polygon: ThreeBSPPolygon, coplanar_front: ThreeBSPPolygon[], coplanar_back: ThreeBSPPolygon[], front: ThreeBSPPolygon[], back: ThreeBSPPolygon[]): void;
    }
    /**
     * 结点
     */
    class ThreeBSPNode {
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
        constructor(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        });
        /**
         * 获取几何体数据
         */
        getGeometryData(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 克隆
         */
        clone(): ThreeBSPNode;
        /**
         * 构建树结点
         * @param polygons 多边形列表
         */
        build(polygons: ThreeBSPPolygon[]): this;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        isConvex(polys: ThreeBSPPolygon[]): boolean;
        /**
         * 所有多边形
         */
        allPolygons(): ThreeBSPPolygon[];
        /**
         * 翻转
         */
        invert(): this;
        /**
         * 裁剪多边形
         * @param polygons
         */
        clipPolygons(polygons: ThreeBSPPolygon[]): ThreeBSPPolygon[];
        clipTo(node: ThreeBSPNode): this;
    }
}
//# sourceMappingURL=ThreeBSP.d.ts.map