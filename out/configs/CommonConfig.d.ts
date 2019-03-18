import { MenuItem } from "../ui/components/Menu";
/**
 * 菜单配置
 */
export declare var menuConfig: MenuConfig;
/**
 * 菜单配置
 */
export declare class MenuConfig {
    /**
     * 主菜单
     */
    getMainMenu(): MenuItem[];
    /**
     * 层级界面创建3D对象列表数据
     */
    getCreateObjectMenu(): MenuItem[];
    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    getCreateComponentMenu(gameobject: feng3d.GameObject): MenuItem[];
}
//# sourceMappingURL=CommonConfig.d.ts.map