namespace editor
{
    /**
     * 重铸导航
     * 
     *  将接收的网格模型转换为导航网格数据
     * 
     * #### 设计思路
     * 1. 将接收到的网格模型的所有三角形栅格化为体素保存到三维数组内
     * 1. 遍历所有体素计算出可行走体素
     * 1. 构建可行走轮廓
     * 1. 构建可行走（导航）网格
     * 
     * #### 参考
     * @see https://github.com/recastnavigation/recastnavigation
     */
    export class Recastnavigation
    {
        /**
         * 包围盒
         */
        private _aabb: feng3d.Box;
        /**
         * 体素尺寸
         */
        private _voxelSize: number;
        /**
         * X 轴上 体素数量
         */
        private _numX: number;
        /**
         * Y 轴上 体素数量
         */
        private _numY: number;
        /**
         * Z 轴上 体素数量
         */
        private _numZ: number;
        /**
         * 体素三维数组
         */
        private _voxels: Voxel[][][];

        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh: { positions: number[], indices: number[] }, voxelSize = 0.1)
        {
            this._aabb = feng3d.Box.formPositions(mesh.positions);
            this._voxelSize = voxelSize;
            // 
            var size = this._aabb.getSize().divideNumber(this._voxelSize).ceil();
            this._numX = size.x + 1;
            this._numY = size.y + 1;
            this._numZ = size.z + 1;
            //
            this._voxels = [];
            for (let x = 0; x < this._numX; x++)
            {
                this._voxels[x] = [];
                for (let y = 0; y < this._numY; y++)
                {
                    this._voxels[x][y] = [];
                }
            }

            this._rasterizeMesh(mesh.indices, mesh.positions);

        }

        /**
         * 获取体素列表
         */
        getVoxels()
        {
            var voxels: Voxel[] = [];
            for (let x = 0; x < this._numX; x++)
            {
                for (let y = 0; y < this._numY; y++)
                {
                    for (let z = 0; z < this._numZ; z++)
                    {
                        if (this._voxels[x][y][z]) voxels.push(this._voxels[x][y][z]);
                    }
                }
            }
            return voxels;
        }

        /**
         * 栅格化网格
         */
        private _rasterizeMesh(indices: number[], positions: number[])
        {
            for (let i = 0, n = indices.length; i < n; i += 3)
            {
                var pi0 = indices[i] * 3;
                var p0 = [positions[pi0], positions[pi0 + 1], positions[pi0 + 2]];
                var pi1 = indices[i + 1] * 3;
                var p1 = [positions[pi1], positions[pi1 + 1], positions[pi1 + 2]]
                var pi2 = indices[i + 2] * 3
                var p2 = [positions[pi2], positions[pi2 + 1], positions[pi2 + 2]]
                this._rasterizeTriangle(p0, p1, p2);
            }
        }

        /**
         * 栅格化三角形
         * @param p0 三角形第一个顶点
         * @param p1 三角形第二个顶点
         * @param p2 三角形第三个顶点
         */
        private _rasterizeTriangle(p0: number[], p1: number[], p2: number[])
        {
            var positions = p0.concat(p1).concat(p2).map((v, i) =>
            {
                if (i % 3 == 0) return Math.round((v - this._aabb.min.x) / this._voxelSize);
                if (i % 3 == 1) return Math.round((v - this._aabb.min.y) / this._voxelSize);
                if (i % 3 == 2) return Math.round((v - this._aabb.min.z) / this._voxelSize);
            });

            var triangle = feng3d.Triangle3D.fromPositions(positions);
            var result = triangle.rasterize();

            result.forEach((v, i) =>
            {
                if (i % 3 == 0)
                {
                    var x = result[i];
                    var y = result[i + 1];
                    var z = result[i + 2]
                    this._voxels[x][y][z] = {
                        x: this._aabb.min.x + x * this._voxelSize,
                        y: this._aabb.min.y + y * this._voxelSize,
                        z: this._aabb.min.z + z * this._voxelSize,
                        type: VoxelType.Triangle
                    }
                }
            });
        }
    }

    /**
     * 体素
     */
    interface Voxel
    {
        x: number;
        y: number;
        z: number;
        type: VoxelType;
    }

    /**
     * 体素类型
     */
    enum VoxelType
    {

        Triangle,
    }
}