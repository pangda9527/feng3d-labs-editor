/**
 * 菜单
 */
export declare var menu: Menu;
export declare type MenuItem = {
    /**
     * 显示标签
     */
    label?: string;
    accelerator?: string;
    role?: string;
    type?: 'separator';
    /**
     * 点击事件
     */
    click?: () => void;
    /**
     * 子菜单
     */
    submenu?: MenuItem[];
    /**
     * 是否启用，禁用时显示灰色
     */
    enable?: boolean;
    /**
     * 是否显示，默认显示
     */
    show?: boolean;
};
export declare class Menu {
    /**
     * 弹出菜单
     *
     *
     * @param menuItems 菜单数据
     *
     * @returns
该功能存在一个暂时无法解决的bug
```
[{
label: "Rendering",
submenu: [
    { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
    { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
    { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
]
}]
```
如上代码中 ``` "Camera" ``` 比 ``` "DirectionalLight" ``` 要短时会出现子菜单盖住父菜单情况，代码需要修改如下才能规避该情况
```
[{
label: "Rendering",
submenu: [
    { label: "DirectionalLight", click: () => { gameobject.addComponent(feng3d.DirectionalLight); } },
    { label: "Camera", click: () => { gameobject.addComponent(feng3d.Camera); } },
    { label: "PointLight", click: () => { gameobject.addComponent(feng3d.PointLight); } },
]
}]
```
     *
     */
    popup(menuItems: MenuItem[]): void;
    /**
     * 处理菜单中 show==false的菜单项
     *
     * @param menuItem 菜单数据
     */
    private handleShow;
    /**
     * 弹出枚举选择菜单
     *
     * @param enumDefinition 枚举定义
     * @param currentValue 当前枚举值
     * @param selectCallBack 选择回调
     */
    popupEnum(enumDefinition: Object, currentValue: any, selectCallBack: (v: any) => void): void;
}
//# sourceMappingURL=Menu.d.ts.map