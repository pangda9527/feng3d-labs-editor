import { NavigationAgent } from "../navigation/Navigation";
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
export declare class Recastnavigation {
    /**
     * 包围盒
     */
    private _aabb;
    /**
     * 体素尺寸
     */
    private _voxelSize;
    /**
     * X 轴上 体素数量
     */
    private _numX;
    /**
     * Y 轴上 体素数量
     */
    private _numY;
    /**
     * Z 轴上 体素数量
     */
    private _numZ;
    /**
     * 体素三维数组
     */
    private _voxels;
    /**
     * 导航代理
     */
    private _agent;
    /**
     * 用于体素区分是否同属一个三角形
     */
    private _triangleId;
    /**
     * 执行重铸导航
     */
    doRecastnavigation(mesh: {
        positions: number[];
        indices: number[];
    }, agent?: NavigationAgent, voxelSize?: feng3d.Vector3): void;
    /**
     * 获取体素列表
     */
    getVoxels(): Voxel[];
    /**
     * 栅格化网格
     */
    private _voxelizationMesh;
    /**
     * 栅格化三角形
     * @param p0 三角形第一个顶点
     * @param p1 三角形第二个顶点
     * @param p2 三角形第三个顶点
     */
    private _voxelizationTriangle;
    /**
     * 应用代理进行计算出可行走体素
     */
    private _applyAgent;
    /**
     * 筛选出允许行走坡度的体素
     */
    private _applyAgentMaxSlope;
    private _applyAgentHeight;
    private _applyAgentRadius;
    private _calculateContour;
    private _checkContourVoxel;
    private _isVoxelFlagDefault;
}
/**
 * 体素
 */
export interface Voxel {
    x: number;
    y: number;
    z: number;
    normal: feng3d.Vector3;
    triangleId: number;
    flag: VoxelFlag;
}
export declare enum VoxelFlag {
    Default = 0,
    DontMaxSlope = 1,
    DontHeight = 2,
    IsContour = 4
}
//# sourceMappingURL=Recastnavigation.d.ts.map