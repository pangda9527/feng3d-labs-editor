"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Navigation_1 = require("../navigation/Navigation");
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
var Recastnavigation = /** @class */ (function () {
    function Recastnavigation() {
        /**
         * 用于体素区分是否同属一个三角形
         */
        this._triangleId = 0;
    }
    /**
     * 执行重铸导航
     */
    Recastnavigation.prototype.doRecastnavigation = function (mesh, agent, voxelSize) {
        if (agent === void 0) { agent = new Navigation_1.NavigationAgent(); }
        this._aabb = feng3d.Box.formPositions(mesh.positions);
        this._voxelSize = voxelSize || new feng3d.Vector3(agent.radius / 3, agent.radius / 3, agent.radius / 3);
        this._agent = agent;
        // 
        var size = this._aabb.getSize().divide(this._voxelSize).ceil();
        this._numX = size.x + 1;
        this._numY = size.y + 1;
        this._numZ = size.z + 1;
        //
        this._voxels = [];
        for (var x = 0; x < this._numX; x++) {
            this._voxels[x] = [];
            for (var y = 0; y < this._numY; y++) {
                this._voxels[x][y] = [];
            }
        }
        this._voxelizationMesh(mesh.indices, mesh.positions);
        this._applyAgent();
    };
    /**
     * 获取体素列表
     */
    Recastnavigation.prototype.getVoxels = function () {
        var voxels = [];
        for (var x = 0; x < this._numX; x++) {
            for (var y = 0; y < this._numY; y++) {
                for (var z = 0; z < this._numZ; z++) {
                    if (this._voxels[x][y][z])
                        voxels.push(this._voxels[x][y][z]);
                }
            }
        }
        return voxels;
    };
    /**
     * 栅格化网格
     */
    Recastnavigation.prototype._voxelizationMesh = function (indices, positions) {
        for (var i = 0, n = indices.length; i < n; i += 3) {
            var pi0 = indices[i] * 3;
            var p0 = [positions[pi0], positions[pi0 + 1], positions[pi0 + 2]];
            var pi1 = indices[i + 1] * 3;
            var p1 = [positions[pi1], positions[pi1 + 1], positions[pi1 + 2]];
            var pi2 = indices[i + 2] * 3;
            var p2 = [positions[pi2], positions[pi2 + 1], positions[pi2 + 2]];
            this._voxelizationTriangle(p0, p1, p2);
        }
    };
    /**
     * 栅格化三角形
     * @param p0 三角形第一个顶点
     * @param p1 三角形第二个顶点
     * @param p2 三角形第三个顶点
     */
    Recastnavigation.prototype._voxelizationTriangle = function (p0, p1, p2) {
        var _this = this;
        var triangle = feng3d.Triangle3D.fromPositions(p0.concat(p1).concat(p2));
        var normal = triangle.getNormal();
        var result = triangle.rasterizeCustom(this._voxelSize, this._aabb.min);
        result.forEach(function (v, i) {
            _this._voxels[v.xi][v.yi][v.zi] = {
                x: v.xv,
                y: v.yv,
                z: v.zv,
                normal: normal,
                triangleId: _this._triangleId,
                flag: VoxelFlag.Default,
            };
        });
        this._triangleId++;
    };
    /**
     * 应用代理进行计算出可行走体素
     */
    Recastnavigation.prototype._applyAgent = function () {
        this._agent.maxSlope;
        this._applyAgentMaxSlope();
        this._applyAgentHeight();
        // this._applyAgentRadius();
    };
    /**
     * 筛选出允许行走坡度的体素
     */
    Recastnavigation.prototype._applyAgentMaxSlope = function () {
        var mincos = Math.cos(this._agent.maxSlope * feng3d.FMath.DEG2RAD);
        this.getVoxels().forEach(function (v) {
            var dot = v.normal.dot(feng3d.Vector3.Y_AXIS);
            if (dot < mincos)
                v.flag = v.flag | VoxelFlag.DontMaxSlope;
        });
    };
    Recastnavigation.prototype._applyAgentHeight = function () {
        for (var x = 0; x < this._numX; x++) {
            for (var z = 0; z < this._numZ; z++) {
                var preVoxel = null;
                for (var y = this._numY - 1; y >= 0; y--) {
                    var voxel = this._voxels[x][y][z];
                    if (!voxel)
                        continue;
                    // 不同属一个三角形且上下距离小于指定高度
                    if (preVoxel != null && preVoxel.triangleId != voxel.triangleId && preVoxel.y - voxel.y < this._agent.height) {
                        voxel.flag = voxel.flag | VoxelFlag.DontHeight;
                    }
                    preVoxel = voxel;
                }
            }
        }
    };
    Recastnavigation.prototype._applyAgentRadius = function () {
        this._calculateContour();
    };
    Recastnavigation.prototype._calculateContour = function () {
        for (var x = 0; x < this._numX; x++) {
            for (var y = 0; y < this._numY; y++) {
                for (var z = 0; z < this._numZ; z++) {
                    this._checkContourVoxel(x, y, z);
                }
            }
        }
    };
    Recastnavigation.prototype._checkContourVoxel = function (x, y, z) {
        var voxel = this._voxels[x][y][z];
        if (!voxel)
            return;
        if (x == 0 || x == this._numX - 1 || y == 0 || y == this._numY - 1 || z == 0 || z == this._numZ - 1) {
            voxel.flag = voxel.flag | VoxelFlag.IsContour;
            return;
        }
        // this._getRoundVoxels();
        // 获取周围格子
        if (voxel.normal.equals(feng3d.Vector3.Z_AXIS)) {
        }
        voxel.normal;
        voxel.normal;
        if (!(this._isVoxelFlagDefault(x, y, z + 1) || this._voxels[x][y + 1][z + 1] || this._voxels[x][y - 1][z + 1])) {
            voxel.flag = voxel.flag | VoxelFlag.IsContour;
            return;
        } // 前
        if (!(this._voxels[x][y][z - 1] || this._voxels[x][y + 1][z - 1] || this._voxels[x][y - 1][z - 1])) {
            voxel.flag = voxel.flag | VoxelFlag.IsContour;
            return;
        } // 后
        if (!(this._voxels[x - 1][y][z] || this._voxels[x - 1][y + 1][z] || this._voxels[x - 1][y - 1][z])) {
            voxel.flag = voxel.flag | VoxelFlag.IsContour;
            return;
        } // 左
        if (!(this._voxels[x + 1][y][z] || this._voxels[x + 1][y + 1][z] || this._voxels[x + 1][y - 1][z])) {
            voxel.flag = voxel.flag | VoxelFlag.IsContour;
            return;
        } // 右
    };
    Recastnavigation.prototype._isVoxelFlagDefault = function (x, y, z) {
        var voxel = this._voxels[x][y][z];
        if (!voxel)
            return false;
        return voxel.flag == VoxelFlag.Default;
    };
    return Recastnavigation;
}());
exports.Recastnavigation = Recastnavigation;
var VoxelFlag;
(function (VoxelFlag) {
    VoxelFlag[VoxelFlag["Default"] = 0] = "Default";
    VoxelFlag[VoxelFlag["DontMaxSlope"] = 1] = "DontMaxSlope";
    VoxelFlag[VoxelFlag["DontHeight"] = 2] = "DontHeight";
    VoxelFlag[VoxelFlag["IsContour"] = 4] = "IsContour";
})(VoxelFlag = exports.VoxelFlag || (exports.VoxelFlag = {}));
//# sourceMappingURL=Recastnavigation.js.map