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
        private _voxelSize: feng3d.Vector3;
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
         * 导航代理
         */
        private _agent: NavigationAgent;

        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh: { positions: number[], indices: number[] }, agent = new NavigationAgent(), voxelSize = new feng3d.Vector3(0.1, 0.1, 0.1))
        {
            this._aabb = feng3d.Box.formPositions(mesh.positions);
            this._voxelSize = voxelSize;
            this._agent = agent;
            // 
            var size = this._aabb.getSize().divide(this._voxelSize).ceil();
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
            this._applyAgent();
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
            var triangle = feng3d.Triangle3D.fromPositions(p0.concat(p1).concat(p2));
            var normal = triangle.getNormal();
            var result = triangle.rasterizeCustom(this._voxelSize, this._aabb.min);

            result.forEach((v, i) =>
            {
                this._voxels[v.xi][v.yi][v.zi] = {
                    x: v.xv,
                    y: v.yv,
                    z: v.zv,
                    normal: normal,
                    flag: VoxelFlag.Default,
                }
            });
        }

        /**
         * 应用代理进行计算出可行走体素
         */
        private _applyAgent()
        {
            this._agent.maxSlope

            this._applyAgentMaxSlope();
            this._applyAgentHeight();
            this._applyAgentRadius();
        }

        /**
         * 筛选出允许行走坡度的体素
         */
        private _applyAgentMaxSlope()
        {
            var up = new feng3d.Vector3(0, 1, 0);
            var mincos = Math.cos(this._agent.maxSlope * feng3d.FMath.DEG2RAD);

            this.getVoxels().forEach(v =>
            {
                var dot = v.normal.dot(up);
                if (Math.abs(dot) < mincos)
                    v.flag = v.flag | VoxelFlag.DontMaxSlope;
            });
        }

        private _applyAgentHeight()
        {
            for (let x = 0; x < this._numX; x++)
            {
                for (let z = 0; z < this._numZ; z++)
                {
                    var preY = Number.MAX_VALUE;
                    for (let y = this._numY - 1; y >= 0; y--)
                    {
                        var voxel = this._voxels[x][y][z];
                        if (!voxel) continue;
                        if ((preY - voxel.y) < this._agent.height)
                        {
                            voxel.flag = voxel.flag | VoxelFlag.DontHeight;
                        }
                        preY = voxel.y;
                    }
                }
            }
        }

        private _applyAgentRadius()
        {
            this._calculateContour();
        }

        private _calculateContour()
        {
            for (let x = 0; x < this._numX; x++)
            {
                for (let y = 0; y < this._numY; y++)
                {
                    for (let z = 0; z < this._numZ; z++)
                    {
                        var voxel = this._voxels[x][y][z];
                        if (!voxel) continue;
                        if (x == 0 || x == this._numX - 1 || y == 0 || y == this._numY - 1 || z == 0 || z == this._numZ - 1) { voxel.flag = voxel.flag | VoxelFlag.IsContour; continue; }
                        if (!(this._voxels[x][y][z + 1] || this._voxels[x][y + 1][z + 1] || this._voxels[x][y - 1][z + 1])) { voxel.flag = voxel.flag | VoxelFlag.IsContour; continue; }// 前
                        if (!(this._voxels[x][y][z - 1] || this._voxels[x][y + 1][z - 1] || this._voxels[x][y - 1][z - 1])) { voxel.flag = voxel.flag | VoxelFlag.IsContour; continue; }// 后
                        if (!(this._voxels[x - 1][y][z] || this._voxels[x - 1][y + 1][z] || this._voxels[x - 1][y - 1][z])) { voxel.flag = voxel.flag | VoxelFlag.IsContour; continue; }// 左
                        if (!(this._voxels[x + 1][y][z] || this._voxels[x + 1][y + 1][z] || this._voxels[x + 1][y - 1][z])) { voxel.flag = voxel.flag | VoxelFlag.IsContour; continue; }// 右
                    }
                }
            }
        }

        private _isContourVoxel(xi: number, yi: number, zi: number)
        {
            // if(this._voxels[xi][yi][zi] == null)

        }
    }

    /**
     * 体素
     */
    export interface Voxel
    {
        x: number;
        y: number;
        z: number;
        normal: feng3d.Vector3;

        flag: VoxelFlag;
    }

    export enum VoxelFlag
    {
        Default = 0,
        DontMaxSlope = 1,
        DontHeight = 2,
        IsContour = 4,
    }


}