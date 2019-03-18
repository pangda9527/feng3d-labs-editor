/**
 * 导航代理
 */
export declare class NavigationAgent {
    /**
     * 距离边缘半径
     */
    radius: number;
    /**
     * 允许行走高度
     */
    height: number;
    /**
     * 允许爬上的阶梯高度
     */
    stepHeight: number;
    /**
     * 允许行走坡度
     */
    maxSlope: number;
}
/**
 * 导航组件，提供生成导航网格功能
 */
export declare class Navigation extends feng3d.Component {
    agent: NavigationAgent;
    private _navobject;
    private _recastnavigation;
    private _allowedVoxelsPointGeometry;
    private _rejectivedVoxelsPointGeometry;
    private _debugVoxelsPointGeometry;
    init(gameobject: feng3d.GameObject): void;
    /**
     * 清楚oav网格模型
     */
    clear(): void;
    /**
     * 计算导航网格数据
     */
    bake(): void;
    /**
     * 获取参与导航的几何体列表
     * @param gameobject
     * @param geometrys
     */
    private _getNavGeometrys;
}
//# sourceMappingURL=Navigation.d.ts.map