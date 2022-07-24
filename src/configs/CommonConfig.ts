import { createNodeMenu, GameObject, getComponentType, globalEmitter, loader, MenuItem, View } from 'feng3d';
import { editorRS } from '../assets/EditorRS';
import { nativeAPI } from '../assets/NativeRequire';
import { editorcache } from '../caches/Editorcache';
import { editorData } from '../Editor';
import { hierarchy } from '../feng3d/hierarchy/Hierarchy';
import { editorui } from '../global/editorui';
import { ShortCutSetting } from '../shortcut/ShortCutSetting';
import { AnimationView } from '../ui/animation/AnimationView';
import { editorAsset } from '../ui/assets/EditorAsset';
import { ProjectView } from '../ui/assets/ProjectView';
import { popupview } from '../ui/components/Popupview';
import { TabView } from '../ui/components/TabView';
import { HierarchyView } from '../ui/hierarchy/HierarchyView';
import { InspectorView } from '../ui/inspector/InspectorView';
import { SceneView } from '../ui/SceneView';
import { viewLayoutConfig } from './ViewLayoutConfig';

/**
 * 菜单配置
 */
export var menuConfig: MenuConfig;

/**
 * 创建对象菜单
 */
export var createObjectMenu: MenuItem[] = [];

/**
 * 菜单配置
 */
export class MenuConfig
{
    /**
     * 主菜单
     */
    getMainMenu()
    {
        var mainMenu: MenuItem[] = [
            {
                label: "文件",
                submenu: [
                    {
                        label: "新建场景",
                        click: () =>
                        {
                            editorData.gameScene = View.createNewScene();
                        },
                    },
                    {
                        label: "打开场景",
                        click: () =>
                        {
                            alert("未实现！");
                            //
                            // editorData.gameScene = View.createNewScene();
                        },
                    },
                    {
                        label: "新建项目", click: () =>
                        {
                            popupview.popupObject({ newprojectname: "newproject" }, {
                                closecallback: (data) =>
                                {
                                    if (data.newprojectname && data.newprojectname.length > 0)
                                    {
                                        editorcache.projectname = data.newprojectname;
                                        window.location.reload();
                                    }
                                }
                            });
                        },
                    },
                    {
                        label: "打开最近的项目",
                        submenu: editorcache.lastProjects.map(element =>
                        {
                            var menuItem: MenuItem =
                            {
                                label: element, click: () =>
                                {
                                    if (editorcache.projectname != element)
                                    {
                                        editorcache.projectname = element;
                                        window.location.reload();
                                    }
                                }
                            };
                            return menuItem;
                        }),
                        click: () =>
                        {
                            popupview.popupObject({ newprojectname: "newproject" }, {
                                closecallback: (data) =>
                                {
                                    if (data.newprojectname && data.newprojectname.length > 0)
                                    {
                                        editorcache.projectname = data.newprojectname;
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    },
                    {
                        label: "保存场景", click: () =>
                        {
                            var gameobject = hierarchy.rootnode.gameobject;
                            editorAsset.saveObject(gameobject);
                        }
                    },
                    {
                        label: "打开项目", click: () =>
                        {
                            editorRS.clearProject(() =>
                            {
                                editorRS.selectFile((filelist) =>
                                {
                                    editorRS.importProject(filelist.item(0), () =>
                                    {
                                        editorAsset.initproject(() =>
                                        {
                                            editorAsset.runProjectScript(() =>
                                            {
                                                editorAsset.readScene("default.scene.json", (err, scene) =>
                                                {
                                                    editorData.gameScene = scene;
                                                    editorui.assetview.invalidateAssettree();
                                                    console.log("打开项目完成!");
                                                });
                                            });
                                        });
                                    });
                                });
                            });

                        }
                    },
                    {
                        label: "导出项目", click: () =>
                        {
                            editorRS.exportProjectToJSZip(`${editorcache.projectname}.zip`);
                        }
                    },
                    {
                        label: "打开网络项目",
                        submenu: [
                            {
                                label: "地形", click: () =>
                                {
                                    openDownloadProject("terrain.zip");
                                },
                            },
                            {
                                label: "自定义材质", click: () =>
                                {
                                    openDownloadProject("customshader.zip");
                                },
                            },
                            {
                                label: "水", click: () =>
                                {
                                    openDownloadProject("water.zip");
                                },
                            },
                            {
                                label: "灯光", click: () =>
                                {
                                    openDownloadProject("light.zip");
                                },
                            },
                            {
                                label: "声音", click: () =>
                                {
                                    openDownloadProject("audio.zip");
                                },
                            },
                        ],
                    },
                    {
                        label: "下载网络项目",
                        submenu: [
                            {
                                label: "地形", click: () =>
                                {
                                    downloadProject("terrain.zip");
                                },
                            },
                            {
                                label: "自定义材质", click: () =>
                                {
                                    downloadProject("customshader.zip");
                                },
                            },
                            {
                                label: "水", click: () =>
                                {
                                    downloadProject("water.zip");
                                },
                            },
                            {
                                label: "灯光", click: () =>
                                {
                                    downloadProject("light.zip");
                                },
                            },
                        ],
                    },
                    {
                        label: "升级项目",
                        click: () =>
                        {
                            editorRS.upgradeProject(() =>
                            {
                                alert("升级完成！");
                            });
                        },
                    },
                    {
                        label: "清空项目",
                        click: () =>
                        {
                            editorAsset.rootFile.remove();
                            editorAsset.initproject(() =>
                            {
                                editorAsset.runProjectScript(() =>
                                {
                                    editorData.gameScene = View.createNewScene()
                                    editorui.assetview.invalidateAssettree();
                                    console.log("清空项目完成!");
                                });
                            });
                        },
                    },
                ],
            },
            { type: "separator" },
            {
                label: "调试",
                submenu: [{
                    label: "打开开发者工具",
                    click: () =>
                    {
                        nativeAPI.openDevTools();
                    }, show: !!nativeAPI,
                },
                {
                    label: "编译脚本",
                    click: () =>
                    {
                        globalEmitter.emit("script.compile");
                    },
                },],
            },
            {
                label: "窗口",
                submenu: this.getWindowSubMenus(),
            },
            {
                label: "帮助",
                submenu: [
                    {
                        label: "问题",
                        click: () =>
                        {
                            window.open("https://github.com/feng3d-labs/editor/issues");
                        },
                    },
                    {
                        label: "文档",
                        click: () =>
                        {
                            window.open("http://com");
                        },
                    },
                ],
            },
        ];

        return mainMenu;
    }

    /**
     * 获取窗口子菜单
     */
    private getWindowSubMenus()
    {
        var menus: MenuItem[] = [
            {
                label: "Layouts",
                submenu: Object.keys(viewLayoutConfig).map(v =>
                {
                    return {
                        label: v,
                        click: () =>
                        {
                            globalEmitter.emit("viewLayout.reset", viewLayoutConfig[v]);
                        },
                    };
                }),
            },
        ];

        // popupview.popupViewWindow(ShortCutSetting.instance, { mode: false, width: 800, height: 600 });

        [SceneView.moduleName,
        InspectorView.moduleName,
        HierarchyView.moduleName,
        ProjectView.moduleName,
        AnimationView.moduleName,
        ShortCutSetting.moduleName,
        ].forEach(v =>
        {
            menus.push({
                label: v,
                click: () =>
                {
                    var tabview = new TabView();
                    tabview.setModuleNames([v]);
                    tabview.left = tabview.right = tabview.top = tabview.bottom = 0;
                    popupview.popupViewWindow(tabview, { mode: false });
                },
            });
        })

        return menus;
    }

    /**
     * 层级界面创建3D对象列表数据
     */
    getCreateObjectMenu()
    {
        var createObjectMenu: MenuItem[] = [];
        //
        createNodeMenu.forEach((item) =>
        {
            let submenu = createObjectMenu;
            const paths = item.path.split("/");
            let targetItem: MenuItem;
            for (let i = 0; i < paths.length; i++)
            {
                targetItem = submenu.filter((item0) =>
                {
                    return item0.label === paths[i];
                })[0];
                if (!targetItem)
                {
                    targetItem = { label: paths[i] };
                    submenu.push(targetItem);
                }
                if (!targetItem.submenu)
                {
                    targetItem.submenu = [];
                }
                submenu = targetItem.submenu;
            }
            if (item.priority !== undefined)
            {
                targetItem.priority = item.priority;
            }
            if (item.click !== undefined)
            {
                targetItem.click = () =>
                {
                    const gameObject = item.click();
                    hierarchy.addGameObject(gameObject);
                };
            }
        });

        // 排序
        const sortSubMenu = (submenu: MenuItem[]) =>
        {
            if (!submenu)
            {
                return;
            }
            submenu.sort((a, b) =>
            {
                if (a.priority === undefined) a.priority = 0;
                if (b.priority === undefined) b.priority = 0;
                return b.priority - a.priority;
            });
            for (let i = 0; i < submenu.length; i++)
            {
                sortSubMenu(submenu[i].submenu);
            }
            for (let i = submenu.length - 2; i >= 0; i--)
            {
                // 优先级跨度 10000 时，中间增加 横格线。
                if (~~(submenu[i].priority / 10000) > ~~(submenu[i + 1].priority / 10000))
                {
                    submenu.splice(i + 1, 0, { type: "separator" });
                }
            }
        };

        sortSubMenu(createObjectMenu);

        return createObjectMenu;
    }

    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    getCreateComponentMenu(gameobject: GameObject)
    {
        var menu: MenuItem[] = [];

        // 处理 由 AddComponentMenu 添加的菜单
        menuConfig.component.forEach(item =>
        {
            var paths = item.path.split("/");
            var currentmenu = menu;
            var currentMenuItem: MenuItem = null;
            paths.forEach(p =>
            {
                if (currentMenuItem)
                {
                    if (!currentMenuItem.submenu) currentMenuItem.submenu = [];
                    currentmenu = currentMenuItem.submenu;
                    currentMenuItem = null;
                }
                currentMenuItem = currentmenu.filter(m => m.label == p)[0];
                if (!currentMenuItem)
                {
                    currentMenuItem = { label: p }
                    currentmenu.push(currentMenuItem);
                };
            });
            currentMenuItem.click = () =>
            {
                const componentClass = getComponentType(item.type);
                gameobject.addComponent(componentClass);
            }
        });

        return menu;
    }

}
menuConfig = new MenuConfig();

/**
 * 下载项目
 * @param projectname 
 */
function openDownloadProject(projectname: string, callback?: () => void)
{
    editorAsset.rootFile.delete();
    downloadProject(projectname, callback);
}

/**
 * 下载项目
 * @param projectname 
 */
function downloadProject(projectname: string, callback?: () => void)
{
    var path = "projects/" + projectname;
    loader.loadBinary(path, (content) =>
    {
        editorRS.importProject(<any>content, () =>
        {
            editorAsset.initproject(() =>
            {
                editorAsset.runProjectScript(() =>
                {
                    editorAsset.readScene("default.scene.json", (err, scene) =>
                    {
                        editorData.gameScene = scene;
                        editorui.assetview.invalidateAssettree();
                        console.log(`${projectname} 项目下载完成!`);
                        callback && callback();
                    });
                });
            });
        });
    });
}
